'use client';

import './style.scss';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Castle from './components/castle';

gsap.registerPlugin(useGSAP);

function Example1() {
  useGSAP((context, contextSafe) => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(),
      breakPoint = 800;

    mm.add(
      {
        // set up any number of arbitrarily-named conditions. The function below will be called when ANY of them match.
        isDesktop: `(min-width: ${breakPoint}px) and (prefers-reduced-motion: no-preference)`,
        isMobile: `(max-width: ${
          breakPoint - 1
        }px) and (prefers-reduced-motion: no-preference)`,
      },
      (context) => {
        // context.conditions has a boolean property for each condition defined above indicating if it's matched or not.
        const { isDesktop, isMobile } = context.conditions!,
          target = isDesktop ? '.desktop' : '.mobile',
          tl = gsap.timeline({
            scrollTrigger: {
              trigger: '.gray',
              scrub: 1,
              end: '200%',
              pin: true,
            },
          });
        tl.to(target, { scale: 2, rotation: 360 }).to(target, { scale: 1 });

        // works for non-ScrollTrigger animations too:
        gsap.to(target, {
          backgroundColor: '#2c7ad2',
          duration: 0.8,
          ease: 'none',
          repeat: -1,
          yoyo: true,
        });

        return () => {
          // optionally return a cleanup function that will be called when the media query no longer matches
        };
      }
    );
  });

  return (
    <div className="example1">
      <header>
        <p>
          <strong>Scroll down!</strong>
        </p>
        <p className="lead">
          When the viewport is less than 800px, the Mobile &lt;div&gt; will
          animate. Otherwise, Desktop will.
        </p>
      </header>
      <section className="gray">
        <div className="mobile">Mobile</div>
        <div className="desktop">Desktop</div>
      </section>
      <section className="bottom lead">
        <p>
          <strong>Pretty cool, right?</strong>
        </p>
        <p>
          Resize your screen. 800px is the break point. It&apos;s all dynamic!
        </p>
      </section>
    </div>
  );
}

function Example2() {
  useGSAP((context, contextSafe) => {
    gsap.registerPlugin(ScrollTrigger); // matchMedia() requires ScrollTrigger plugin

    const wideRatio = '(min-aspect-ratio: 4/3)',
      midRatio = '(min-aspect-ratio: 3/4) and (max-aspect-ratio: 4/3)',
      tallRatio = '(max-aspect-ratio: 3/4)';

    const mm = gsap.matchMedia();

    mm.add(wideRatio, () => {
      // wide aspect ratio screen
      gsap.set('rect', {
        attr: { 'stroke-dasharray': (i) => (i == 0 ? '10 10' : '') },
      });
    });

    mm.add(midRatio, () => {
      // mid (squarish) aspect ratio screen
      gsap.set('rect', {
        attr: { 'stroke-dasharray': (i) => (i == 1 ? '10 10' : '') },
      });
    });

    mm.add(tallRatio, () => {
      // tall (narrow) aspect ratio screen
      gsap.set('rect', {
        attr: { 'stroke-dasharray': (i) => (i == 2 ? '10 10' : '') },
      });
    });

    gsap.to('rect', {
      attr: { 'stroke-dashoffset': -20 },
      ease: 'none',
      repeat: -1,
    });
  });
  return (
    <div className="example2">
      <div>
        <h2>Aspect Ratio Demo</h2>
      </div>

      <svg viewBox="0 0 500 1500" stroke="#000" strokeWidth="5" fill="none">
        <rect x="50" y="100" width="400" height="300" />
        <rect x="100" y="500" width="300" height="300" />
        <rect x="100" y="900" width="300" height="400" />
      </svg>
    </div>
  );
}

export default function ClientPage() {
  return (
    <div className="match-media-container flex flex-1 flex-col gap-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-1">
        <div className="aspect-video bg-muted/50 flex items-center">
          <Example1 />
        </div>
      </div>
      <div className="min-h-[100vh] flex-1 bg-muted/50 md:min-h-min">
        <Example2 />
      </div>
      <div className="min-h-[100vh] flex-1 bg-muted/50 md:min-h-min">
        <Castle />
      </div>
    </div>
  );
}
