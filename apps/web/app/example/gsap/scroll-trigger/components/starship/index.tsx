'use client';

import { useRef } from 'react';
import './index.scss';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Example() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    (context, contextSafe) => {
      gsap.registerPlugin(ScrollTrigger);
      const stars = document.querySelector('.stars')!;

      gsap.set('.fadeLeft', { x: -400 });
      gsap.set('.fadeRight', { scaleX: -1, x: 1600 });

      for (let i = 0; i < 200; i++) {
        // make stars
        const star = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'circle'
        );
        stars.appendChild(star);
        gsap.set(star, {
          attr: { class: 'star', r: 1.5 },
          opacity: 0,
          x: 600,
          y: 400,
        });
      }

      // make a timeline for the animation loop
      const tl = gsap
        .timeline({
          repeat: -1,
          scrollTrigger: {
            trigger: '.s1',
            start: 'top bottom',
            end: 'bottom top',
            toggleActions: 'play pause play none', //pause while not in view
          },
        })
        .to(
          '.star',
          {
            duration: 0.8,
            opacity: 1,
            ease: 'power2.in',
            stagger: { repeat: -1, repeatDelay: 0.2, amount: 1 },
          },
          0
        )
        .to(
          '.star',
          {
            duration: 1,
            x: (i) =>
              i % 2 == 0
                ? gsap.utils.random(-400, 1600)
                : gsap.utils.mapRange(
                    0,
                    1,
                    -400,
                    1600,
                    gsap.utils.random(0, 1, 1)
                  ),
            y: (i) =>
              i % 2 == 0
                ? gsap.utils.random(0, 800, 800)
                : gsap.utils.random(0, 800),
            ease: 'power2.in',
            stagger: { repeat: -1, amount: 1 },
          },
          0
        )
        .to(
          '.falcon',
          {
            duration: 1,
            svgOrigin: () =>
              gsap.utils.random(-570, 610) + ' ' + gsap.utils.random(-380, 400),
            rotate: () => gsap.utils.random(1, -1),
            repeatRefresh: true,
            repeat: -1,
            ease: 'sine.inOut',
          },
          0
        )
        .play(99) //jumping forward in time will skip over the initial stars animation
        .timeScale(0.5); //slower, so it's not too distracting

      // make a separate timeline for the intro animation
      gsap
        .timeline({
          paused: true,
          scrollTrigger: {
            trigger: '.s1',
            start: '35% 75%',
            once: true,
          },
        })
        .from(
          '.falcon image',
          {
            duration: 2,
            scale: 2.5,
            xPercent: -180,
            yPercent: 99,
            ease: 'power4.inOut',
          },
          0
        )
        .from('.stars', { opacity: 0 }, 0)
        .fromTo(
          '.txtMF',
          { scale: 0.2, svgOrigin: '600 425' },
          { duration: 3, scale: 1.4, ease: 'power3' },
          1
        )
        .from(
          '.txtMF',
          { duration: 3, drawSVG: '100% 100%', ease: 'power4' },
          0
        );
    },
    { scope: container }
  );

  return (
    <div ref={container} className="starship-container">
      <section className="s0">
        Previous Section
        <br />
        <span style={{ fontSize: '0.7em', opacity: 0.5 }}>(scroll down)</span>
      </section>

      <section className="s1">
        <svg
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="grad1"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="200"
              y2="0"
            >
              <stop offset="0" stopColor="#000" />
              <stop offset="1" stopColor="rgba(0,0,0,0)" />
            </linearGradient>
          </defs>

          <g className="stars" fill="#fff"></g>

          <rect
            className="fadeLeft"
            width="200"
            height="800"
            fill="url(#grad1)"
          />
          <rect
            className="fadeRight"
            width="200"
            height="800"
            fill="url(#grad1)"
          />

          <g className="falcon">
            <image
              href="https://assets.codepen.io/721952/falcon.png"
              width="963"
              height="563"
              x="-180"
              y="350"
            />
          </g>

          <path
            className="txtMF"
            stroke="yellow"
            d="M293.5 310.9v-42.3h13.8l9.3 17.6 9.2-17.6h13.8v42.3h-13.8v-17.6l-8.8 17.6h-.8l-8.8-17.6v17.6h-13.9zm48.3-42.3h13.8v42.3h-13.8v-42.3zm16.7 42.3v-42.3h13.8v29.7h22.9v12.6h-36.7zm38.5 0v-42.3h13.8v29.7h22.9v12.6H397zm38.4 0v-42.3h36.3v12.6h-22.5v4.9h14.5v7.4h-14.5v4.9h26.1V311h-39.9zm39.9 0v-42.3H489l12.6 15.8v-15.8h13.8v42.3h-13.8L489 295.1v15.8h-13.7zm41.3-42.3h13.8v42.3h-13.8v-42.3zm29 0v25c-.1 2.9.4 4.8 1.6 5.9s3.1 1.7 5.7 1.8c2.1 0 3.8-.6 5.2-1.8s2-3.1 2-5.9v-25h13.8v24.8c-.1 3.5-.6 6.3-1.7 8.4-1.1 2.1-2.5 3.9-4.2 5.3s-3.8 2.5-6.4 3.3-5.4 1.2-8.5 1.3c-2.6-.1-5.2-.4-7.9-1.1s-5-1.7-7-3.1-3.5-3.2-4.6-5.4c-1.1-2.2-1.6-5.1-1.6-8.6v-24.8h13.6zm29.7 42.3v-42.3H589l9.3 17.6 9.2-17.6h13.8v42.3h-13.8v-17.6l-8.8 17.6h-.8l-8.8-17.6v17.6h-13.8zm76.7 0v-42.3h36.3v12.6h-22.5v4.9h14.5v7.4h-14.5V311H652zm34.8 0 13.9-42.3h21l14.2 42.3h-16l-2.7-7.6h-12.6l-2.7 7.6h-15.1zm24.5-32.9-6.1 16.8h11.7l-5.6-16.8zm24 32.9v-42.3h13.8v29.7H772v12.6h-36.7zm66.9-12.6h13.2v12.6h-18.8c-4.6 0-8.7-.8-12.5-2.4-3.7-1.6-6.6-4.1-8.8-7.3-2.1-3.3-3.2-7.3-3.2-12 0-3.3.6-6.3 1.9-8.9s3.1-4.8 5.3-6.5 4.9-3 7.8-3.9 6.1-1.3 9.4-1.3h18.7v12.6H802c-3 0-5.2.1-6.6.3s-2.7.5-3.8.9-2.1 1.1-3 2.1c-.9 1-1.4 2.8-1.5 5.4.1 2.5.6 4.3 1.5 5.4.9 1.1 2 1.8 3.3 2.1s2.6.6 4 .7c1.6.2 3.6.2 6.3.2zm62.1-8.3c0 4.6-1 8.6-2.9 11.8-1.9 3.3-4.7 5.7-8.4 7.4s-8 2.5-13.1 2.5-9.4-.8-13.1-2.5c-3.6-1.7-6.4-4.1-8.3-7.3-1.9-3.2-2.8-7.2-2.8-11.9 0-3.5.5-6.6 1.6-9.3 1.1-2.7 2.6-4.9 4.7-6.8 2.1-1.8 4.6-3.2 7.6-4.2 3-.9 6.4-1.4 10.2-1.4 5.1 0 9.4.8 13.1 2.5s6.5 4.1 8.4 7.4 3 7.2 3 11.8zm-33.5.1c0 2.7.6 5.1 1.8 7.1 1.2 2 3.6 3 7.2 3 2.8 0 4.8-.5 6.2-1.6s2.2-2.3 2.6-3.6c.3-1.4.6-3 .7-4.9-.1-2.7-.8-5.1-2-7.1s-3.7-3-7.5-3c-6 0-9 3.4-9 10.1zm35.6 20.8v-42.3h13.8l12.6 15.8v-15.8h13.8v42.3h-13.8l-12.6-15.8v15.8h-13.8z"
          />
        </svg>
      </section>

      <section className="s2">Following Section</section>
    </div>
  );
}
