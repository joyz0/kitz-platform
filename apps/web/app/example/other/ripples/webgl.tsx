'use client';

import { useEffect, useRef } from 'react';
import './webgl.scss';
import { createRipples } from '../../components/create-ripples';

export default function WebGL() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const disableBtn = document.querySelector('.js-ripples-disable')!;
    const playBtn = document.querySelector('.js-ripples-play')!;
    const pauseBtn = document.querySelector('.js-ripples-pause')!;
    const ripple1 = createRipples(containerRef.current!, {
      resolution: 512,
      dropRadius: 20,
      perturbance: 0.04,
    });
    const ripple2 = createRipples(sectionRef.current!, {
      resolution: 128,
      dropRadius: 10,
      perturbance: 0.04,
      interactive: false,
    });
    function handleHide() {
      ripple1.destroy();
      ripple2.destroy();
    }
    function handlePlay() {
      ripple1.play();
      ripple2.play();
    }
    function handlePause() {
      ripple1.pause();
      ripple2.pause();
    }
    disableBtn.addEventListener('click', handleHide);
    playBtn.addEventListener('click', handlePlay);
    pauseBtn.addEventListener('click', handlePause);

    const timer = setInterval(function () {
      const x = Math.random() * sectionRef.current!.clientWidth;
      const y = Math.random() * sectionRef.current!.clientHeight;
      const dropRadius = 20;
      const strength = 0.04 + Math.random() * 0.04;
      ripple2.drop(x, y, dropRadius, strength);
    }, 400);

    return () => {
      disableBtn.removeEventListener('click', handleHide);
      playBtn.removeEventListener('click', handlePlay);
      pauseBtn.removeEventListener('click', handlePause);
      clearInterval(timer);
    };
  }, []);

  return (
    <div ref={containerRef} className="ripples-container">
      <section ref={sectionRef}>
        <header>
          <h1>波纹特效</h1>
        </header>

        <p>
          <button className="js-ripples-pause" type="button">
            时停
          </button>
          <button className="js-ripples-play" type="button">
            恢复
          </button>
          <button className="js-ripples-disable" type="button">
            摧毁
          </button>
        </p>
      </section>
      <div className="error"></div>
    </div>
  );
}
