'use client';

import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import './step2step-animation.css';

export default function Example() {
  const container = useRef<HTMLTableSectionElement>(null);
  useGSAP(
    (context, contextSafe) => {
      const states = [
          toInitState,
          toFirstState,
          toLastState,
          toInvertState,
          toPlayState,
          toEndState,
        ],
        target = container.current!,
        prevEl = target.querySelector('.prev')!,
        nextEl = target.querySelector('.next')!,
        stateIndexWrap = gsap.utils.wrap(0, states.length),
        stepBlurbs = gsap.utils.toArray('.steps p')! as HTMLDivElement[],
        boxEl = target.querySelector('.box')! as HTMLDivElement,
        windowEl = target.querySelector('.window')! as HTMLDivElement,
        finalContainerEl = target.querySelector(
          '.finalContainer'
        )! as HTMLDivElement;
      let stateIndex = 0;

      gsap.defaults({ duration: 0.4, overwrite: 'auto' });

      const handleClickPrev = contextSafe!(() => {
        goToState(stateIndex - 1);
      });
      const handleClickNext = contextSafe!(() => {
        goToState(stateIndex - 1);
      });
      prevEl.addEventListener('click', handleClickPrev);
      nextEl.addEventListener('click', handleClickNext);

      let transition: gsap.core.Timeline;
      const resize = contextSafe!(() => {
        if (transition) {
          transition.kill();
        }

        // reset (put back in original container and remove any inline styles)
        windowEl.appendChild(boxEl);
        boxEl.style.cssText = '';

        // grab the original state
        const state = Flip.getState(boxEl);

        // put into the new container
        finalContainerEl.appendChild(boxEl);

        // FLIP!
        transition = Flip.from(state, {
          scale: true,
          duration: 1,
          repeat: -1,
          repeatDelay: 1.5,
          ease: 'power1.inOut',
          paused: true,
        })
          .progress(1)
          .progress(0); // lock in the starting/ending values.

        if (stateIndex === 2 || stateIndex === 3) {
          transition.progress(1);
        } else if (stateIndex === 4 || stateIndex === 5) {
          transition.play();
        }
      });

      function goToState(newState: number) {
        stateIndex = stateIndexWrap(newState);
        states[stateIndex]();
      }

      function updateBlurb() {
        const textState = Flip.getState(stepBlurbs);

        gsap.set(stepBlurbs, { display: 'none' });
        gsap.set(stepBlurbs[stateIndex], { display: 'block' });

        Flip.from(textState, {
          duration: 0.4,
          absolute: true,
          onLeave: (elements) =>
            gsap.to(elements, { opacity: 0, duration: 0.3 }),
          onEnter: (elements) =>
            gsap.fromTo(
              elements,
              { opacity: 0 },
              { opacity: 1, duration: 0.3 }
            ),
        });
      }

      function toInitState() {
        transition.pause(0);
        gsap.to(boxEl, { opacity: 1 });
        gsap.to('.boxPosition', { autoAlpha: 0 });
        updateBlurb();
      }

      function toFirstState() {
        transition.pause(0);
        gsap.to(boxEl, { opacity: 0.5 });
        gsap.to('.initialPosition', { autoAlpha: 1 });
        gsap.to('.finalPosition', { autoAlpha: 0 });
        updateBlurb();
      }

      function toLastState() {
        gsap.killTweensOf(transition);
        gsap.set(boxEl, { opacity: 1 });
        transition.progress(1).pause();
        gsap.to('.finalPosition', { autoAlpha: 1 });
        updateBlurb();
      }

      function toInvertState() {
        transition.tweenFromTo('>', 0, { duration: 1, overwrite: true });
        updateBlurb();
      }

      function toPlayState() {
        gsap.killTweensOf(transition);
        gsap.to('.boxPosition', { autoAlpha: 1 });
        transition.play();
        updateBlurb();
      }

      function toEndState() {
        gsap.to(boxEl, { opacity: 1 });
        gsap.to('.boxPosition', { autoAlpha: 1 });
        transition.play();
        updateBlurb();
      }

      function init() {
        window.addEventListener('resize', resize);
        resize();
      }

      init();

      return () => {
        // <-- cleanup (remove listeners here)
        prevEl.removeEventListener('click', handleClickPrev);
        nextEl.removeEventListener('click', handleClickNext);
        window.removeEventListener('resize', resize);
      };
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      className="step2step-animation-container"
      data-state="initial"
    >
      <button className="prev">&lsaquo;</button>

      <div className="window">
        <div className="boxPosition initialPosition"></div>
        <div className="box gradient-blue">Flip</div>
        <div className="finalContainer">
          <div className="boxPosition finalPosition"></div>
        </div>
      </div>

      <div className="steps">
        <p>
          If we reparent the blue div into a new rotated &amp; scaled container
          (altering the DOM structure), how could we animate there seamlessly?
          Use the &quot;FLIP&quot; animation technique! Press the right arrow to
          begin.
        </p>

        <p>
          <strong>&quot;First&quot;:</strong> Get the initial state.
          <br />
          <code>
            const state ={' '}
            <a href="https://greensock.com/docs/v3/Plugins/Flip/static.getState()">
              Flip.getState(targets)
            </a>
          </code>
        </p>
        <p>
          <strong>&quot;Last&quot;:</strong> Put elements in their final state.
          In this case we&apos;ll place the element in the new container
          &lt;div&gt; which results in a totally different position, scale, and
          rotation.
        </p>
        <p>
          <strong>&quot;Invert&quot;:</strong> Make the element <i>appear</i> in
          its previous position/size by applying offsets instantly. That way, it{' '}
          <i>looks</i> like it hasn&apos;t moved yet.{' '}
          <i>
            Note: we animate this step in the demo to illustrate what normally
            happens immediately.
          </i>
        </p>
        <p>
          <strong>&quot;Play&quot;:</strong> Animate the removal of those
          offsets.
          <br />
          <code>
            <a href="https://greensock.com/docs/v3/Plugins/Flip/static.from()">
              Flip.from(state, options)
            </a>
          </code>{' '}
          returns a GSAP timeline so you can add other animations, control it,
          etc.
        </p>

        <p>
          GSAP&apos;s{' '}
          <a href="https://greensock.com/docs/v3/Plugins/Flip">Flip Plugin</a>{' '}
          makes this a breeze!{' '}
        </p>
      </div>

      <button className="next">&rsaquo;</button>
    </section>
  );
}
