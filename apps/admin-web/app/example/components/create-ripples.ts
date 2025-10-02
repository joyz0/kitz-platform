interface RipplesOptions {
  imageUrl?: string;
  dropRadius?: number;
  perturbance?: number;
  resolution?: number;
  interactive?: boolean;
  crossOrigin?: string;
}

let gl: WebGLRenderingContext | null;

function getPropertyValue(el: HTMLElement, key: string) {
  const styles = window.getComputedStyle(el);
  return styles.getPropertyValue(key);
}

function isPercentage(str: string) {
  return str[str.length - 1] == '%';
}

function loadConfig() {
  const canvas = document.createElement('canvas');
  gl =
    canvas.getContext('webgl') ||
    (canvas.getContext('experimental-webgl') as WebGLRenderingContext);

  if (!gl) {
    return null;
  }
  const extensions: Record<string, any> = {};
  [
    'OES_texture_float',
    'OES_texture_half_float',
    'OES_texture_float_linear',
    'OES_texture_half_float_linear',
  ].forEach(function (name: string) {
    const extension = gl?.getExtension(name);
    if (extension) {
      extensions[name] = extension;
    }
  });

  // If no floating point extensions are supported we can bail out early.
  if (!extensions.OES_texture_float) {
    return null;
  }

  const configs: any[] = [];

  function createConfig(
    type: string,
    glType: number,
    arrayType: Float32ArrayConstructor | null
  ) {
    const name = 'OES_texture_' + type,
      nameLinear = name + '_linear',
      linearSupport = nameLinear in extensions,
      configExtensions = [name];

    if (linearSupport) {
      configExtensions.push(nameLinear);
    }

    return {
      type: glType,
      arrayType: arrayType,
      linearSupport: linearSupport,
      extensions: configExtensions,
    };
  }

  configs.push(createConfig('float', gl.FLOAT, Float32Array));

  if (extensions.OES_texture_half_float) {
    configs.push(
      // Array type should be Uint16Array, but at least on iOS that breaks. In that case we
      // just initialize the textures with data=null, instead of data=new Uint16Array(...).
      // This makes initialization a tad slower, but it's still negligible.
      createConfig(
        'half_float',
        extensions.OES_texture_half_float.HALF_FLOAT_OES,
        null
      )
    );
  }

  // Setup the texture and framebuffer
  const texture = gl.createTexture();
  const framebuffer = gl.createFramebuffer();

  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  // Check for each supported texture type if rendering to it is supported
  let config = null;

  for (let i = 0; i < configs.length; i++) {
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      32,
      32,
      0,
      gl.RGBA,
      configs[i].type,
      null
    );

    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0
    );
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
      config = configs[i];
      break;
    }
  }

  return config;
}

function createImageData(width: number, height: number) {
  try {
    return new ImageData(width, height);
  } catch (e) {
    // Fallback for IE
    const canvas = document.createElement('canvas');
    return canvas.getContext('2d')!.createImageData(width, height);
  }
}

function translateBackgroundPosition(value: string) {
  const parts = value.split(' ');

  if (parts.length === 1) {
    switch (value) {
      case 'center':
        return ['50%', '50%'];
      case 'top':
        return ['50%', '0'];
      case 'bottom':
        return ['50%', '100%'];
      case 'left':
        return ['0', '50%'];
      case 'right':
        return ['100%', '50%'];
      default:
        return [value, '50%'];
    }
  } else {
    return parts.map(function (part) {
      switch (value) {
        case 'center':
          return '50%';
        case 'top':
        case 'left':
          return '0';
        case 'right':
        case 'bottom':
          return '100%';
        default:
          return part;
      }
    });
  }
}

function createProgram(
  vertexSource: string,
  fragmentSource: string,
  uniformValues: any
) {
  if (!gl) {
    return;
  }
  function compileSource(type: number, source: string) {
    const shader = gl!.createShader(type)!;
    gl?.shaderSource(shader, source);
    gl?.compileShader(shader);
    if (!gl?.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error('compile error: ' + gl?.getShaderInfoLog(shader));
    }
    return shader;
  }

  const program: any = {
    id: gl.createProgram()!,
    uniforms: {},
    locations: {},
  };

  gl.attachShader(program.id, compileSource(gl.VERTEX_SHADER, vertexSource)!);
  gl.attachShader(
    program.id,
    compileSource(gl.FRAGMENT_SHADER, fragmentSource)!
  );
  gl.linkProgram(program.id);
  if (!gl.getProgramParameter(program.id, gl.LINK_STATUS)) {
    throw new Error('link error: ' + gl.getProgramInfoLog(program.id));
  }

  // Fetch the uniform and attribute locations
  gl.useProgram(program.id);
  gl.enableVertexAttribArray(0);
  let match: RegExpExecArray;
  const regex = /uniform (\w+) (\w+)/g;
  const shaderCode = vertexSource + fragmentSource;
  let name: any;
  while ((match = regex.exec(shaderCode)!) != null) {
    name = match[2];
    program.locations[name] = gl.getUniformLocation(program.id, name);
  }

  return program;
}

function bindTexture(texture: WebGLTexture, unit = 0) {
  if (!gl) {
    return;
  }
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
}

function extractUrl(value: string) {
  const urlMatch = /url\(["']?([^"']*)["']?\)/.exec(value);
  if (urlMatch == null) {
    return null;
  }

  return urlMatch[1];
}

function isDataUri(url: string) {
  return url.match(/^data:/);
}

function setup() {
  let config, transparentPixels;

  if (typeof window !== 'undefined') {
    config = loadConfig();
    transparentPixels = createImageData(32, 32);

    // Extend the css
    const style = document.createElement('style');
    style.appendChild(
      document.createTextNode(
        '.kitz-ripples { position: relative; z-index: 0; }'
      )
    );
    (document.head || document.getElementsByTagName('head')[0]).insertBefore(
      style,
      document.head.firstChild
    );
  }

  return { config, transparentPixels };
}

const { config, transparentPixels } = setup();

class Ripples {
  static DEFAULTS = {
    imageUrl: null,
    resolution: 256,
    dropRadius: 20,
    perturbance: 0.03,
    interactive: true,
    crossOrigin: '',
  };

  $el: HTMLElement;
  $canvas: HTMLCanvasElement;
  interactive: RipplesOptions['interactive'];
  resolution: RipplesOptions['resolution'];
  perturbance: RipplesOptions['perturbance'];
  dropRadius: RipplesOptions['dropRadius'];
  crossOrigin: RipplesOptions['crossOrigin'];
  imageUrl: RipplesOptions['imageUrl'];
  textureDelta: Float32Array;
  context: WebGLRenderingContext;
  textures: WebGLTexture[] = [];
  framebuffers: WebGLFramebuffer[] = [];
  bufferWriteIndex: number = 0;
  bufferReadIndex: number = 1;
  quad?: WebGLBuffer;
  visible = false;
  running = false;
  inited = false;
  destroyed = true;
  originalCssBackgroundImage?: string;
  imageSource?: string;
  backgroundTexture?: WebGLTexture;
  backgroundWidth?: number;
  backgroundHeight?: number;
  dropProgram: any;
  updateProgram: any;
  renderProgram: any;
  originalInlineCss?: string;
  handleMouseMove?: (e: MouseEvent) => void;
  handleMouseDown?: (e: MouseEvent) => void;
  handleTouchMove?: (e: TouchEvent) => void;
  handleTouchStart?: (e: TouchEvent) => void;

  constructor(el: HTMLElement, options: RipplesOptions) {
    const that = this;
    this.$el = el;
    // Init properties from options
    this.interactive = options.interactive;
    this.resolution = options.resolution;
    this.textureDelta = new Float32Array([
      1 / this.resolution!,
      1 / this.resolution!,
    ]);
    this.perturbance = options.perturbance;
    this.dropRadius = options.dropRadius;
    this.crossOrigin = options.crossOrigin;
    this.imageUrl = options.imageUrl;

    // Init WebGL canvas
    const canvas = document.createElement('canvas');
    canvas.width = this.$el.clientWidth;
    canvas.height = this.$el.clientHeight;
    this.$canvas = canvas;
    this.$canvas.style.setProperty('position', 'absolute');
    this.$canvas.style.setProperty('inset', '0');
    this.$canvas.style.setProperty('z-index', '-1');

    this.$el.classList.add('kitz-ripples');
    this.$el.appendChild(canvas);
    this.context = gl =
      canvas.getContext('webgl') ||
      (canvas.getContext('experimental-webgl')! as WebGLRenderingContext);

    // Load extensions
    if (config) {
      config.extensions.forEach(function (name: any) {
        gl!.getExtension(name);
      });

      // Auto-resize when window size changes.
      this.updateSize = this.updateSize.bind(this);
      window.addEventListener('resize', this.updateSize);

      const arrayType = config.arrayType;
      const textureData = arrayType
        ? new arrayType(this.resolution! * this.resolution! * 4)
        : null;

      for (let i = 0; i < 2; i++) {
        const texture = gl.createTexture();
        const framebuffer = gl.createFramebuffer();

        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_MIN_FILTER,
          config.linearSupport ? gl.LINEAR : gl.NEAREST
        );
        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_MAG_FILTER,
          config.linearSupport ? gl.LINEAR : gl.NEAREST
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          this.resolution!,
          this.resolution!,
          0,
          gl.RGBA,
          config.type,
          textureData
        );

        gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          gl.COLOR_ATTACHMENT0,
          gl.TEXTURE_2D,
          texture,
          0
        );

        this.textures.push(texture!);
        this.framebuffers.push(framebuffer!);
      }

      // Init GL stuff
      this.quad = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, +1, -1, +1, +1, -1, +1]),
        gl.STATIC_DRAW
      );

      this.initShaders();
      this.initTexture();
      this.setTransparentTexture();

      // Load the image either from the options or CSS rules
      this.loadImage();

      // Set correct clear color and blend mode (regular alpha blending)
      gl.clearColor(0, 0, 0, 0);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      // Plugin is successfully initialized!
      this.visible = true;
      this.running = true;
      this.inited = true;
      this.destroyed = false;

      this.setupPointerEvents();
    }

    // Init animation
    function _step() {
      if (!that.destroyed) {
        that.step();

        requestAnimationFrame(_step);
      }
    }
    requestAnimationFrame(_step);
  }

  // Set up pointer (mouse + touch) events
  setupPointerEvents() {
    const that = this;

    function pointerEventsEnabled() {
      return that.visible && that.running && that.interactive;
    }

    function dropAtPointer(pointer: any, big: boolean) {
      if (pointerEventsEnabled()) {
        that.dropAtPointer(
          pointer,
          that.dropRadius! * (big ? 1.5 : 1),
          big ? 0.14 : 0.01
        );
      }
    }

    function handleMouseMove(e: MouseEvent) {
      dropAtPointer(e, false);
    }
    function handleTouchMove(e: TouchEvent) {
      const touches = e.changedTouches;
      for (let i = 0; i < touches.length; i++) {
        dropAtPointer(touches[i], false);
      }
    }
    function handleTouchStart(e: TouchEvent) {
      const touches = e.changedTouches;
      for (let i = 0; i < touches.length; i++) {
        dropAtPointer(touches[i], false);
      }
    }
    function handleMouseDown(e: MouseEvent) {
      dropAtPointer(e, true);
    }

    // Start listening to pointer events
    this.handleMouseMove = handleMouseMove.bind(this);
    this.handleTouchMove = handleTouchMove.bind(this);
    this.handleTouchStart = handleTouchStart.bind(this);
    this.handleMouseDown = handleMouseDown.bind(this);
    this.$el.addEventListener('mousemove', this.handleMouseMove);
    this.$el.addEventListener('touchmove', this.handleTouchMove, {
      passive: true,
    });
    this.$el.addEventListener('touchstart', this.handleTouchStart, {
      passive: true,
    });
    this.$el.addEventListener('mousedown', this.handleMouseDown);
  }

  // Load the image either from the options or the element's CSS rules.
  loadImage() {
    const that = this;

    gl = this.context;

    const newImageSource =
      this.imageUrl ||
      extractUrl(this.originalCssBackgroundImage!) ||
      extractUrl(getPropertyValue(this.$el, 'background-image'));

    // If image source is unchanged, don't reload it.
    if (newImageSource == this.imageSource) {
      return;
    }

    this.imageSource = newImageSource!;

    // Falsy source means no background.
    if (!this.imageSource) {
      this.setTransparentTexture();
      return;
    }

    // Load the texture from a new image.
    const image = new Image();
    image.onload = function () {
      gl = that.context;

      // Only textures with dimensions of powers of two can have repeat wrapping.
      function isPowerOfTwo(x: number) {
        return (x & (x - 1)) == 0;
      }

      const wrapping =
        isPowerOfTwo(image.width) && isPowerOfTwo(image.height)
          ? gl.REPEAT
          : gl.CLAMP_TO_EDGE;

      gl.bindTexture(gl.TEXTURE_2D, that.backgroundTexture!);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapping);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapping);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );

      that.backgroundWidth = image.width;
      that.backgroundHeight = image.height;

      // Hide the background that we're replacing.
      that.hideCssBackground();
    };

    // Fall back to a transparent texture when loading the image failed.
    image.onerror = function () {
      gl = that.context;

      that.setTransparentTexture();
    };

    // Disable CORS when the image source is a data URI.
    image.crossOrigin = isDataUri(this.imageSource) ? null : this.crossOrigin!;

    image.src = this.imageSource;
  }

  step() {
    gl = this.context;

    if (!this.visible) {
      return;
    }

    this.computeTextureBoundaries();

    if (this.running) {
      this.update();
    }

    this.render();
  }

  drawQuad() {
    if (!gl) {
      return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad!);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }

  render() {
    if (!gl) {
      return;
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.viewport(0, 0, this.$canvas.width, this.$canvas.height);

    gl.enable(gl.BLEND);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(this.renderProgram.id);

    bindTexture(this.backgroundTexture!, 0);
    bindTexture(this.textures[0] as any, 1);

    gl.uniform1f(this.renderProgram.locations.perturbance, this.perturbance!);
    gl.uniform2fv(
      this.renderProgram.locations.topLeft,
      this.renderProgram.uniforms.topLeft
    );
    gl.uniform2fv(
      this.renderProgram.locations.bottomRight,
      this.renderProgram.uniforms.bottomRight
    );
    gl.uniform2fv(
      this.renderProgram.locations.containerRatio,
      this.renderProgram.uniforms.containerRatio
    );
    gl.uniform1i(this.renderProgram.locations.samplerBackground, 0);
    gl.uniform1i(this.renderProgram.locations.samplerRipples, 1);

    this.drawQuad();
    gl.disable(gl.BLEND);
  }

  update() {
    if (!gl) {
      return;
    }
    gl.viewport(0, 0, this.resolution!, this.resolution!);

    gl.bindFramebuffer(
      gl.FRAMEBUFFER,
      this.framebuffers[this.bufferWriteIndex!]!
    );
    bindTexture(this.textures[this.bufferReadIndex!]!);
    gl.useProgram(this.updateProgram.id);

    this.drawQuad();

    this.swapBufferIndices();
  }

  swapBufferIndices() {
    this.bufferWriteIndex = 1 - this.bufferWriteIndex;
    this.bufferReadIndex = 1 - this.bufferReadIndex;
  }

  computeTextureBoundaries() {
    let backgroundSize: any = getPropertyValue(this.$el, 'background-size');
    const backgroundAttachment = getPropertyValue(
      this.$el,
      'background-attachment'
    );
    const backgroundPosition = translateBackgroundPosition(
      getPropertyValue(this.$el, 'background-position')
    );

    // Here the 'container' is the element which the background adapts to
    // (either the chrome window or some element, depending on attachment)
    let container;
    if (backgroundAttachment == 'fixed') {
      container = {
        left: window.scrollX,
        top: window.scrollY,
        width: 0,
        height: 0,
      };
      container.width = document.documentElement.clientWidth;
      container.height = document.documentElement.clientHeight;
    } else {
      container = this.$el.getBoundingClientRect();
      container.width = document.documentElement.clientWidth;
      container.height = document.documentElement.clientHeight;
    }

    let backgroundWidth: any;
    let backgroundHeight: any;
    // TODO: background-clip
    if (backgroundSize == 'cover') {
      const scale = Math.max(
        container.width / this.backgroundWidth!,
        container.height / this.backgroundHeight!
      );

      backgroundWidth = this.backgroundWidth! * scale;
      backgroundHeight = this.backgroundHeight! * scale;
    } else if (backgroundSize == 'contain') {
      const scale = Math.min(
        container.width / this.backgroundWidth!,
        container.height / this.backgroundHeight!
      );

      backgroundWidth = this.backgroundWidth! * scale;
      backgroundHeight = this.backgroundHeight! * scale;
    } else {
      backgroundSize = backgroundSize.split(' ');
      backgroundWidth = backgroundSize[0] || '';
      backgroundHeight = backgroundSize[1] || backgroundWidth;

      if (isPercentage(backgroundWidth)) {
        backgroundWidth = (container.width * parseFloat(backgroundWidth)) / 100;
      } else if (backgroundWidth != 'auto') {
        backgroundWidth = parseFloat(backgroundWidth);
      }

      if (isPercentage(backgroundHeight)) {
        backgroundHeight =
          (container.height * parseFloat(backgroundHeight)) / 100;
      } else if (backgroundHeight != 'auto') {
        backgroundHeight = parseFloat(backgroundHeight);
      }

      if (backgroundWidth == 'auto' && backgroundHeight == 'auto') {
        backgroundWidth = this.backgroundWidth!;
        backgroundHeight = this.backgroundHeight!;
      } else {
        if (backgroundWidth == 'auto') {
          backgroundWidth =
            this.backgroundWidth! * (backgroundHeight / this.backgroundHeight!);
        }

        if (backgroundHeight == 'auto') {
          backgroundHeight =
            this.backgroundHeight! * (backgroundWidth / this.backgroundWidth!);
        }
      }
    }

    // Compute backgroundX and backgroundY in page coordinates
    let backgroundX: any = backgroundPosition[0];
    let backgroundY: any = backgroundPosition[1];

    if (isPercentage(backgroundX)) {
      backgroundX =
        container.left +
        ((container.width - backgroundWidth) * parseFloat(backgroundX)) / 100;
    } else {
      backgroundX = container.left + parseFloat(backgroundX);
    }

    if (isPercentage(backgroundY)) {
      backgroundY =
        container.top +
        ((container.height - backgroundHeight) * parseFloat(backgroundY)) / 100;
    } else {
      backgroundY = container.top + parseFloat(backgroundY);
    }

    const elementOffset = this.$el.getBoundingClientRect();

    this.renderProgram.uniforms.topLeft = new Float32Array([
      (elementOffset.left - backgroundX) / backgroundWidth,
      (elementOffset.top - backgroundY) / backgroundHeight,
    ]);
    this.renderProgram.uniforms.bottomRight = new Float32Array([
      this.renderProgram.uniforms.topLeft[0] +
        this.$el.clientWidth / backgroundWidth,
      this.renderProgram.uniforms.topLeft[1] +
        this.$el.clientHeight / backgroundHeight,
    ]);

    const maxSide = Math.max(this.$canvas.width, this.$canvas.height);

    this.renderProgram.uniforms.containerRatio = new Float32Array([
      this.$canvas.width / maxSide,
      this.$canvas.height / maxSide,
    ]);
  }

  initShaders() {
    if (!gl) {
      return;
    }
    const vertexShader = [
      'attribute vec2 vertex;',
      'varying vec2 coord;',
      'void main() {',
      'coord = vertex * 0.5 + 0.5;',
      'gl_Position = vec4(vertex, 0.0, 1.0);',
      '}',
    ].join('\n');

    this.dropProgram = createProgram(
      vertexShader,
      [
        'precision highp float;',

        'const float PI = 3.141592653589793;',
        'uniform sampler2D texture;',
        'uniform vec2 center;',
        'uniform float radius;',
        'uniform float strength;',

        'varying vec2 coord;',

        'void main() {',
        'vec4 info = texture2D(texture, coord);',

        'float drop = max(0.0, 1.0 - length(center * 0.5 + 0.5 - coord) / radius);',
        'drop = 0.5 - cos(drop * PI) * 0.5;',

        'info.r += drop * strength;',

        'gl_FragColor = info;',
        '}',
      ].join('\n'),
      undefined
    );

    this.updateProgram = createProgram(
      vertexShader,
      [
        'precision highp float;',

        'uniform sampler2D texture;',
        'uniform vec2 delta;',

        'varying vec2 coord;',

        'void main() {',
        'vec4 info = texture2D(texture, coord);',

        'vec2 dx = vec2(delta.x, 0.0);',
        'vec2 dy = vec2(0.0, delta.y);',

        'float average = (',
        'texture2D(texture, coord - dx).r +',
        'texture2D(texture, coord - dy).r +',
        'texture2D(texture, coord + dx).r +',
        'texture2D(texture, coord + dy).r',
        ') * 0.25;',

        'info.g += (average - info.r) * 2.0;',
        'info.g *= 0.995;',
        'info.r += info.g;',

        'gl_FragColor = info;',
        '}',
      ].join('\n'),
      undefined
    );
    gl.uniform2fv(this.updateProgram.locations.delta, this.textureDelta);

    this.renderProgram = createProgram(
      [
        'precision highp float;',

        'attribute vec2 vertex;',
        'uniform vec2 topLeft;',
        'uniform vec2 bottomRight;',
        'uniform vec2 containerRatio;',
        'varying vec2 ripplesCoord;',
        'varying vec2 backgroundCoord;',
        'void main() {',
        'backgroundCoord = mix(topLeft, bottomRight, vertex * 0.5 + 0.5);',
        'backgroundCoord.y = 1.0 - backgroundCoord.y;',
        'ripplesCoord = vec2(vertex.x, -vertex.y) * containerRatio * 0.5 + 0.5;',
        'gl_Position = vec4(vertex.x, -vertex.y, 0.0, 1.0);',
        '}',
      ].join('\n'),
      [
        'precision highp float;',

        'uniform sampler2D samplerBackground;',
        'uniform sampler2D samplerRipples;',
        'uniform vec2 delta;',

        'uniform float perturbance;',
        'varying vec2 ripplesCoord;',
        'varying vec2 backgroundCoord;',

        'void main() {',
        'float height = texture2D(samplerRipples, ripplesCoord).r;',
        'float heightX = texture2D(samplerRipples, vec2(ripplesCoord.x + delta.x, ripplesCoord.y)).r;',
        'float heightY = texture2D(samplerRipples, vec2(ripplesCoord.x, ripplesCoord.y + delta.y)).r;',
        'vec3 dx = vec3(delta.x, heightX - height, 0.0);',
        'vec3 dy = vec3(0.0, heightY - height, delta.y);',
        'vec2 offset = -normalize(cross(dy, dx)).xz;',
        'float specular = pow(max(0.0, dot(offset, normalize(vec2(-0.6, 1.0)))), 4.0);',
        'gl_FragColor = texture2D(samplerBackground, backgroundCoord + offset * perturbance) + specular;',
        '}',
      ].join('\n'),
      undefined
    );
    gl.uniform2fv(this.renderProgram.locations.delta, this.textureDelta);
  }

  initTexture() {
    if (!gl) {
      return;
    }
    this.backgroundTexture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.backgroundTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }

  setTransparentTexture() {
    if (!gl) {
      return;
    }
    gl.bindTexture(gl.TEXTURE_2D, this.backgroundTexture!);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      transparentPixels!
    );
  }

  hideCssBackground() {
    // Check whether we're changing inline CSS or overriding a global CSS rule.
    const inlineCss = getPropertyValue(this.$el, 'background-image');

    if (inlineCss == 'none') {
      return;
    }

    this.originalInlineCss = inlineCss;

    this.originalCssBackgroundImage = getPropertyValue(
      this.$el,
      'background-image'
    );
    this.$el.style.setProperty('background-image', 'none');
  }

  restoreCssBackground() {
    // Restore background by either changing the inline CSS rule to what it was, or
    // simply remove the inline CSS rule if it never was inlined.
    this.$el.style.setProperty(
      'background-image',
      this.originalInlineCss || ''
    );
  }

  dropAtPointer(pointer: any, radius: number, strength: number) {
    const borderLeft =
        parseInt(getPropertyValue(this.$el, 'border-left-width')) || 0,
      borderTop = parseInt(getPropertyValue(this.$el, 'border-top-width')) || 0;

    this.drop(
      pointer.pageX - this.$el.getBoundingClientRect().left - borderLeft,
      pointer.pageY - this.$el.getBoundingClientRect().top - borderTop,
      radius,
      strength
    );
  }

  /**
   *  Public methods
   */
  drop(x: number, y: number, radius: number, strength: number) {
    gl = this.context;

    const elWidth = this.$el.clientWidth;
    const elHeight = this.$el.clientHeight;
    const longestSide = Math.max(elWidth, elHeight);

    radius = radius / longestSide;

    const dropPosition = new Float32Array([
      (2 * x - elWidth) / longestSide,
      (elHeight - 2 * y) / longestSide,
    ]);

    gl.viewport(0, 0, this.resolution!, this.resolution!);

    gl.bindFramebuffer(
      gl.FRAMEBUFFER,
      this.framebuffers[this.bufferWriteIndex!]!
    );
    bindTexture(this.textures[this.bufferReadIndex!]!);

    gl.useProgram(this.dropProgram.id);
    gl.uniform2fv(this.dropProgram.locations.center, dropPosition);
    gl.uniform1f(this.dropProgram.locations.radius, radius);
    gl.uniform1f(this.dropProgram.locations.strength, strength);

    this.drawQuad();

    this.swapBufferIndices();
  }

  updateSize() {
    const newWidth = this.$el.clientWidth,
      newHeight = this.$el.clientHeight;

    if (newWidth != this.$canvas.width || newHeight != this.$canvas.height) {
      this.$canvas.width = newWidth;
      this.$canvas.height = newHeight;
    }
  }

  destroy() {
    this.$el.classList.remove('kitz-ripples');
    this.$el.removeEventListener('mousemove', this.handleMouseMove!);
    this.$el.removeEventListener('touchmove', this.handleTouchMove!);
    this.$el.removeEventListener('touchstart', this.handleTouchStart!);
    this.$el.removeEventListener('mousedown', this.handleMouseDown!);

    // Make sure the last used context is garbage-collected
    gl = null;

    window.removeEventListener('resize', this.updateSize);

    this.$canvas.remove();
    this.restoreCssBackground();

    this.destroyed = true;
  }

  show() {
    this.visible = true;

    this.$canvas.style.setProperty('display', 'block');
    this.hideCssBackground();
  }

  hide() {
    this.visible = false;

    this.$canvas.style.setProperty('display', 'none');
    this.restoreCssBackground();
  }

  pause() {
    this.running = false;
  }

  play() {
    this.running = true;
  }

  set(property: string, value: never) {
    switch (property) {
      case 'dropRadius':
      case 'perturbance':
      case 'interactive':
      case 'crossOrigin':
        this[property] = value;
        break;
      case 'imageUrl':
        this.imageUrl = value;
        this.loadImage();
        break;
    }
  }
}

export function createRipples(el: HTMLElement, options: RipplesOptions) {
  if (!config) {
    throw new Error(
      'Your browser does not support WebGL, the OES_texture_float extension or rendering to floating point textures.'
    );
  }
  return new Ripples(el, Object.assign({}, Ripples.DEFAULTS, options));
}
