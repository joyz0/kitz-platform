'use client';

import { useEffect, useRef } from 'react';
import './index.scss';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const KONAMI_CODE =
  'arrowup,arrowup,arrowdown,arrowdown,arrowleft,arrowright,arrowleft,arrowright,keyb,keya';
const AUDIO =
  typeof Audio === 'undefined'
    ? { play() {} }
    : new Audio('https://assets.codepen.io/605876/sparkle.mp3');

const Starscape = ({
  densityRatio = 0.5,
  sizeLimit = 5,
  defaultAlpha = 0.2,
  scaleLimit = 2,
  proximityRatio = 0.1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D>(null);
  const starsRef = useRef<any[]>(null);
  const vminRef = useRef<number>(null);
  const scaleMapperRef = useRef<(value: number) => number>(null);
  const alphaMapperRef = useRef<(value: number) => number>(null);
  const codeRef = useRef<any[]>([]);
  const partyRef = useRef<gsap.core.Timeline>(null);

  const isPartying = () =>
    partyRef.current &&
    partyRef.current!.progress() !== 0 &&
    partyRef.current!.progress() !== 1;

  useGSAP((context, contextSafe) => {
    contextRef.current = canvasRef.current!.getContext('2d');
    const LOAD = contextSafe!(() => {
      vminRef.current = Math.min(window.innerHeight, window.innerWidth);
      const STAR_COUNT = Math.floor(vminRef.current * densityRatio);
      scaleMapperRef.current = gsap.utils.mapRange(
        0,
        vminRef.current * proximityRatio,
        scaleLimit,
        1
      );
      alphaMapperRef.current = gsap.utils.mapRange(
        0,
        vminRef.current * proximityRatio,
        1,
        defaultAlpha
      );
      canvasRef.current!.width = window.innerWidth;
      canvasRef.current!.height = window.innerHeight;
      starsRef.current = new Array(STAR_COUNT).fill(undefined).map(() => ({
        hue: 0,
        saturation: 0,
        lightness: 100,
        x: gsap.utils.random(0, window.innerWidth, 1),
        y: gsap.utils.random(0, window.innerHeight, 1),
        size: gsap.utils.random(1, sizeLimit, 1),
        scale: 1,
        alpha: defaultAlpha,
      }));
    });
    const RENDER = contextSafe!(() => {
      contextRef.current!.clearRect(
        0,
        0,
        canvasRef.current!.width,
        canvasRef.current!.height
      );
      starsRef.current!.forEach((star) => {
        contextRef.current!.fillStyle = `hsla(${star.hue}, ${star.saturation}%, ${star.lightness}%, ${star.alpha})`;
        contextRef.current!.beginPath();
        contextRef.current!.arc(
          star.x,
          star.y,
          (star.size / 2) * star.scale,
          0,
          Math.PI * 2
        );
        contextRef.current!.fill();
      });
    });

    const UPDATE = contextSafe!(({ x, y }: { x: number; y: number }) => {
      if (!isPartying()) {
        starsRef.current!.forEach((STAR) => {
          const DISTANCE = Math.sqrt(
            Math.pow(STAR.x - x, 2) + Math.pow(STAR.y - y, 2)
          );
          gsap.to(STAR, {
            scale: scaleMapperRef.current!(
              Math.min(DISTANCE, vminRef.current! * proximityRatio)
            ),
            alpha: alphaMapperRef.current!(
              Math.min(DISTANCE, vminRef.current! * proximityRatio)
            ),
          });
        });
      }
    });

    const EXIT = contextSafe!(() => {
      gsap.to(starsRef.current, {
        scale: 1,
        alpha: defaultAlpha,
      });
    });

    LOAD();
    gsap.ticker.fps(24);
    gsap.ticker.add(RENDER);

    // Set up event handling
    window.addEventListener('resize', LOAD);
    containerRef.current!.addEventListener('pointermove', UPDATE);
    containerRef.current!.addEventListener('pointerleave', EXIT);
    return () => {
      window.removeEventListener('resize', LOAD);
      containerRef.current!.removeEventListener('pointermove', UPDATE);
      containerRef.current!.removeEventListener('pointerleave', EXIT);
      gsap.ticker.remove(RENDER);
    };
  }, []);

  useGSAP((context, contextSafe) => {
    const handleCode = contextSafe!((e: KeyboardEvent) => {
      codeRef.current = [...codeRef.current, e.code].slice(
        codeRef.current.length > 9 ? codeRef.current.length - 9 : 0
      );
      if (
        codeRef.current.join(',').toLowerCase() === KONAMI_CODE &&
        !isPartying()
      ) {
        codeRef.current.length = 0;
        partyRef.current = gsap.timeline().to(starsRef.current, {
          scale: 1,
          alpha: defaultAlpha,
          onComplete: () => {
            AUDIO.play();
          },
        });
        const STAGGER = 0.01;

        for (let s = 0; s < starsRef.current!.length; s++) {
          partyRef.current!.to(
            starsRef.current![s],
            {
              onStart: () => {
                gsap.set(starsRef.current![s], {
                  hue: gsap.utils.random(0, 360),
                  saturation: 80,
                  lightness: 60,
                  alpha: 1,
                });
              },
              onComplete: () => {
                gsap.set(starsRef.current![s], {
                  saturation: 0,
                  lightness: 100,
                  alpha: defaultAlpha,
                });
              },
              x: gsap.utils.random(0, window.innerWidth),
              y: gsap.utils.random(0, window.innerHeight),
              duration: 0.3,
            },
            s * STAGGER
          );
        }
      }
    });
    window.addEventListener('keyup', handleCode);
    return () => {
      window.removeEventListener('keyup', handleCode);
    };
  }, []);

  return (
    <div className="relative h-full" ref={containerRef}>
      <canvas ref={canvasRef} />
    </div>
  );
};

const Linescape1 = ({ cellSize = 20, proximityRatio = 0.25 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D>(null);
  const linesRef = useRef<any[]>(null);
  const vminRef = useRef<number>(null);
  const alphaMapperRef = useRef<(value: number) => number>(null);
  const codeRef = useRef<any[]>([]);
  const partyRef = useRef<gsap.core.Timeline>(null);
  const offsetRef = useRef<any>(null);
  const saturationMapperRef = useRef<(value: number) => number>(null);

  const isPartying = () =>
    partyRef.current &&
    partyRef.current.progress() !== 0 &&
    partyRef.current.progress() !== 1;

  useGSAP((context, contextSafe) => {
    contextRef.current = canvasRef.current!.getContext('2d');
    // In load, we work out how many lines to show and where. We can offset based on the viewport dimensions
    const LOAD = contextSafe!(() => {
      vminRef.current = Math.min(window.innerHeight, window.innerWidth);
      const CELLS_X = window.innerWidth / cellSize;
      const CELLS_Y = window.innerHeight / cellSize;
      const SAFE_CELLS_X = Math.ceil(CELLS_X);
      const SAFE_CELLS_Y = Math.ceil(CELLS_Y);
      // Calculate offset by doing some subtraction
      offsetRef.current = {
        x: (SAFE_CELLS_X - CELLS_X) * 0.5,
        y: (SAFE_CELLS_Y - CELLS_Y) * 0.5,
      };
      canvasRef.current!.width = window.innerWidth;
      canvasRef.current!.height = window.innerHeight;

      saturationMapperRef.current = gsap.utils.mapRange(
        0,
        vminRef.current * proximityRatio,
        100,
        50
      );
      alphaMapperRef.current = gsap.utils.mapRange(
        0,
        vminRef.current * proximityRatio,
        1,
        0.2
      );

      linesRef.current = new Array(SAFE_CELLS_X * SAFE_CELLS_Y)
        .fill(undefined)
        .map((_, index) => {
          return {
            index,
            alpha: 0.2,
            width: gsap.utils.random(0.1, 3, 0.1),
            saturation: 50,
            angle: gsap.utils.random(0, 360),
            hue: gsap.utils.random(0, 359),
            x: index % SAFE_CELLS_X,
            y: Math.floor(index / SAFE_CELLS_X),
          };
        });
    });
    const RENDER = contextSafe!(() => {
      contextRef.current!.clearRect(
        0,
        0,
        canvasRef.current!.width,
        canvasRef.current!.height
      );
      linesRef.current!.forEach((line) => {
        const X = line.x * cellSize - offsetRef.current.x * cellSize;
        const Y = line.y * cellSize - offsetRef.current.y * cellSize;
        // Line is going to be 80 percent of the height
        const MID = {
          x: X + cellSize * 0.5,
          y: Y,
        };
        contextRef.current!.lineWidth = line.width;
        contextRef.current!.strokeStyle = `hsla(${line.hue}, ${line.saturation}%, 75%, ${line.alpha})`;
        contextRef.current!.beginPath();
        contextRef.current!.translate(MID.x, MID.y + cellSize * 0.5);
        contextRef.current!.rotate(line.angle * (Math.PI / 180));
        contextRef.current!.translate(-0, -cellSize * 0.5);
        contextRef.current!.moveTo(0, cellSize * 0.1);
        contextRef.current!.lineTo(0, cellSize * 0.9);
        contextRef.current!.stroke();
        contextRef.current!.closePath();
        // Reset the translations
        contextRef.current!.setTransform(1, 0, 0, 1, 0, 0);
      });
    });

    const UPDATE = contextSafe!(({ x, y }: { x: number; y: number }) => {
      if (!isPartying()) {
        linesRef.current!.forEach((LINE) => {
          const DISTANCE = Math.sqrt(
            Math.pow(LINE.x * cellSize + cellSize * 0.5 - x, 2) +
              Math.pow(LINE.y * cellSize + cellSize * 0.5 - y, 2)
          );
          const saturation = saturationMapperRef.current!(
            Math.min(DISTANCE, vminRef.current! * proximityRatio)
          );
          const alpha = alphaMapperRef.current!(
            Math.min(DISTANCE, vminRef.current! * proximityRatio)
          );

          gsap.to(LINE, {
            saturation,
            alpha,
          });
        });
      }
    });

    const EXIT = contextSafe!(() => {
      gsap.to(linesRef.current, {
        saturation: 50,
        alpha: 0.2,
      });
    });

    LOAD();
    gsap.ticker.fps(24);
    gsap.ticker.add(RENDER);

    // Set up event handling
    window.addEventListener('resize', LOAD);
    containerRef.current!.addEventListener('pointermove', UPDATE);
    containerRef.current!.addEventListener('pointerleave', EXIT);
    return () => {
      window.removeEventListener('resize', LOAD);
      containerRef.current!.removeEventListener('pointermove', UPDATE);
      containerRef.current!.removeEventListener('pointerleave', EXIT);
      gsap.ticker.remove(RENDER);
    };
  }, []);

  useGSAP((context, contextSafe) => {
    const handleCode = contextSafe!((e: KeyboardEvent) => {
      codeRef.current = [...codeRef.current, e.code].slice(
        codeRef.current.length > 9 ? codeRef.current.length - 9 : 0
      );
      if (
        codeRef.current.join(',').toLowerCase() === KONAMI_CODE &&
        !isPartying()
      ) {
        codeRef.current.length = 0;
      }
    });
    window.addEventListener('keyup', handleCode);
    return () => {
      window.removeEventListener('keyup', handleCode);
    };
  }, []);

  return (
    <div className="relative h-full" ref={containerRef}>
      <canvas ref={canvasRef} />
    </div>
  );
};

const Linescape2 = ({ cellSize = 20, proximityRatio = 0.25 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D>(null);
  const linesRef = useRef<any[]>(null);
  const vminRef = useRef<number>(null);
  const alphaMapperRef = useRef<(value: number) => number>(null);
  const codeRef = useRef<any[]>([]);
  const partyRef = useRef<gsap.core.Timeline>(null);
  const offsetRef = useRef<any>(null);
  const saturationMapperRef = useRef<(value: number) => number>(null);
  const thicknessMapperRef = useRef<(value: number) => number>(null);

  const isPartying = () =>
    partyRef.current &&
    partyRef.current.progress() !== 0 &&
    partyRef.current.progress() !== 1;

  useGSAP((context, contextSafe) => {
    contextRef.current = canvasRef.current!.getContext('2d');
    // In load, we work out how many lines to show and where. We can offset based on the viewport dimensions
    const LOAD = contextSafe!(() => {
      vminRef.current = Math.min(window.innerHeight, window.innerWidth);
      const CELLS_X = window.innerWidth / cellSize;
      const CELLS_Y = window.innerHeight / cellSize;
      const SAFE_CELLS_X = Math.ceil(CELLS_X);
      const SAFE_CELLS_Y = Math.ceil(CELLS_Y);
      // Calculate offset by doing some subtraction
      offsetRef.current = {
        x: (SAFE_CELLS_X - CELLS_X) * 0.5,
        y: (SAFE_CELLS_Y - CELLS_Y) * 0.5,
      };
      canvasRef.current!.width = window.innerWidth;
      canvasRef.current!.height = window.innerHeight;

      saturationMapperRef.current = gsap.utils.mapRange(
        0,
        vminRef.current * proximityRatio,
        100,
        50
      );
      alphaMapperRef.current = gsap.utils.mapRange(
        0,
        vminRef.current * proximityRatio,
        1,
        0.2
      );
      thicknessMapperRef.current = gsap.utils.mapRange(
        0,
        vminRef.current * proximityRatio,
        4,
        0
      );

      linesRef.current = new Array(SAFE_CELLS_X * SAFE_CELLS_Y)
        .fill(undefined)
        .map((_, index) => {
          return {
            index,
            width: gsap.utils.random(0.1, 3, 0.1),
            thickness: 0,
            alpha: 0.2,
            saturation: 50,
            angle: 0,
            hue: gsap.utils.random(0, 359),
            x: index % SAFE_CELLS_X,
            y: Math.floor(index / SAFE_CELLS_X),
          };
        });
    });
    const RENDER = contextSafe!(() => {
      contextRef.current!.clearRect(
        0,
        0,
        canvasRef.current!.width,
        canvasRef.current!.height
      );
      linesRef.current!.forEach((line) => {
        const X = line.x * cellSize - offsetRef.current.x * cellSize;
        const Y = line.y * cellSize - offsetRef.current.y * cellSize;
        // Line is going to be 80 percent of the height
        const MID = {
          x: X + cellSize * 0.5,
          y: Y,
        };
        contextRef.current!.lineWidth = line.width + line.thickness;
        contextRef.current!.strokeStyle = `hsla(${line.hue}, ${line.saturation}%, 75%, ${line.alpha})`;
        contextRef.current!.beginPath();
        contextRef.current!.translate(MID.x, MID.y + cellSize * 0.5);
        contextRef.current!.rotate(line.angle * (Math.PI / 180));
        contextRef.current!.translate(-0, -cellSize * 0.5);
        contextRef.current!.moveTo(0, cellSize * 0.1);
        contextRef.current!.lineTo(0, cellSize * 0.9);
        contextRef.current!.stroke();
        contextRef.current!.closePath();
        // Reset the translations
        contextRef.current!.setTransform(1, 0, 0, 1, 0, 0);
      });
    });

    const UPDATE = contextSafe!(({ x, y }: { x: number; y: number }) => {
      if (!isPartying()) {
        linesRef.current!.forEach((LINE) => {
          const CENTER_X = LINE.x * cellSize + cellSize * 0.5;
          const CENTER_Y = LINE.y * cellSize + cellSize * 0.5;
          const DISTANCE = Math.sqrt(
            Math.pow(CENTER_X - x, 2) + Math.pow(CENTER_Y - y, 2)
          );
          let angle =
            (Math.abs(Math.atan2(CENTER_Y - y, CENTER_X - x)) * 180) / Math.PI -
            270;
          angle = angle + 360 / 360;
          const saturation = saturationMapperRef.current!(
            Math.min(DISTANCE, vminRef.current! * proximityRatio)
          );
          const alpha = alphaMapperRef.current!(
            Math.min(DISTANCE, vminRef.current! * proximityRatio)
          );
          const thickness = thicknessMapperRef.current!(
            Math.min(DISTANCE, vminRef.current! * proximityRatio)
          );

          gsap.to(LINE, {
            angle,
            saturation,
            alpha,
            thickness,
          });
        });
      }
    });

    const EXIT = contextSafe!(() => {
      gsap.to(linesRef.current, {
        saturation: 50,
        alpha: 0.2,
        thickness: 0,
      });
    });

    LOAD();
    gsap.ticker.fps(24);
    gsap.ticker.add(RENDER);

    // Set up event handling
    window.addEventListener('resize', LOAD);
    containerRef.current!.addEventListener('pointermove', UPDATE);
    containerRef.current!.addEventListener('pointerleave', EXIT);
    return () => {
      window.removeEventListener('resize', LOAD);
      containerRef.current!.removeEventListener('pointermove', UPDATE);
      containerRef.current!.removeEventListener('pointerleave', EXIT);
      gsap.ticker.remove(RENDER);
    };
  }, []);

  useGSAP((context, contextSafe) => {
    const handleCode = contextSafe!((e: KeyboardEvent) => {
      codeRef.current = [...codeRef.current, e.code].slice(
        codeRef.current.length > 9 ? codeRef.current.length - 9 : 0
      );
      if (
        codeRef.current.join(',').toLowerCase() === KONAMI_CODE &&
        !isPartying()
      ) {
        codeRef.current.length = 0;
        partyRef.current = gsap.timeline().to(linesRef.current, {
          thickness: 0,
          alpha: 0.2,
          duration: 0.25,
          onComplete: () => {
            AUDIO.play();
          },
        });
        for (let l = 0; l < linesRef.current!.length; l++) {
          partyRef.current.to(
            linesRef.current![l],
            {
              angle: '+=360',
              duration: 0.5,
              onStart: () => {
                gsap.set(linesRef.current![l], { alpha: 1, thickness: 2 });
              },
              onComplete: () => {
                gsap.set(linesRef.current![l], { alpha: 0.2, thickness: 0 });
              },
            },
            l * 0.0005 + 0.25
          );
        }
      }
    });
    window.addEventListener('keyup', handleCode);
    return () => {
      window.removeEventListener('keyup', handleCode);
    };
  }, []);

  return (
    <div className="relative h-full" ref={containerRef}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export const StarscapeApp = () => {
  return (
    <div className="interactive-backdrop">
      <Starscape
        densityRatio={0.75}
        sizeLimit={10}
        scaleLimit={15}
        proximityRatio={0.2}
      />
    </div>
  );
};

export const Linescape1App = () => {
  return (
    <div className="interactive-backdrop">
      <Linescape1 cellSize={20} />
    </div>
  );
};

export const Linescape2App = () => {
  return (
    <div className="interactive-backdrop">
      <Linescape2 cellSize={20} />
    </div>
  );
};
