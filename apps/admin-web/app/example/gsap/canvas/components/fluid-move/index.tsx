'use client';

import { useRef } from 'react';
import './index.scss';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Example() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    (context, contextSafe) => {
      // wait until there aren't anymore resize events to resize canvas
      const callAfterResize = (func: () => void, delay = 0.2) => {
        const dc = gsap.delayedCall(delay, func).pause(),
          handler = () => dc.restart(true);
        window.addEventListener('resize', handler);
        return handler; // in case you want to window.removeEventListener() later
      };

      // set the canvas to visible in JS to prevent FOUC
      gsap.to('#canvas', { autoAlpha: 1 });

      let canvas: HTMLCanvasElement | null,
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number,
        ratio: number,
        unit: number;

      // number of 'units' across the width
      const units = 100;
      // aspect ratio
      const aspectRatio = [10, 4];

      function scale(n: number) {
        return n * unit;
      }

      function setUp() {
        canvas = document.getElementById('canvas') as HTMLCanvasElement;
        ctx = canvas!.getContext('2d')!;

        ratio = window.devicePixelRatio;

        metrics();
      }
      setUp();

      // setting all the dimensions
      function metrics() {
        // set height and width based on window size
        width = window.innerWidth - 100;
        height = (width / aspectRatio[0]) * aspectRatio[1];

        // setting canvas element dimensions
        canvas!.style.width = `${width}px`;
        canvas!.style.height = `${height}px`;

        // adjust for device pixel ratio
        width *= ratio;
        height *= ratio;

        // establishing a unit system
        unit = width / units;

        // setting the canvas context dimensions
        canvas!.width = width;
        canvas!.height = height;

        console.log(width, height);
      }

      // changing the dimensions on window resize (debounced for perf)
      function handleResize() {
        metrics();
        draw();
      }

      const resize = callAfterResize(handleResize);

      // ---------------------------------------------------------
      // Objects
      // ---------------------------------------------------------

      // make our square a nice tidy little object so GSAP can do stuff with it
      const square = { x: 0, y: 15, width: 10, height: 10 };

      // doodling setup
      function draw() {
        // clear the canvas
        ctx.clearRect(0, 0, width, height);

        // start drawing our square
        ctx.beginPath();
        // now we can use scalable units just like we do in SVG land (x, y, width, height)
        ctx.rect(
          scale(square.x),
          scale(square.y),
          scale(square.width),
          scale(square.height)
        );
        // colouring in
        ctx.fillStyle = '#8d3dae';
        ctx.fill();
      }
      // doodle time
      draw();

      // ---------------------------------------------------------
      // Animation
      // ---------------------------------------------------------

      // For canvas animation you can just use GSAP as you would usually, but with the addition of an onUpdate to redraw the canvas.
      // If you have many tweens you don't have to call this update on each tween. You can do it globally or in a master timeline.

      const tween = gsap.to(square, {
        x: 100 - square.width,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: 'power1.inOut',
        paused: true,
        // unlike DOM elements, canvas needs to be redrawn and cleared on every tick
        onUpdate: draw,
      });

      // toggle
      const button = document.querySelector('button')!;

      const handleStartAnimation = contextSafe!(() => {
        tween.paused(!tween.paused());
        button.innerText = !tween.paused()
          ? 'Pause Animation'
          : 'Play Animation';
      });

      button.addEventListener('click', handleStartAnimation);

      return () => {
        button.removeEventListener('click', handleStartAnimation);
        window.removeEventListener('resize', resize);
      };
    },
    { scope: container }
  );

  return (
    <div ref={container} className="fluid-move-container">
      <canvas id="canvas"></canvas>
      <button>Play Animation</button>
    </div>
  );
}
