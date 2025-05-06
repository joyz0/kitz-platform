'use client';

import './style.scss';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Flip } from 'gsap/Flip';
import Step2stepAnimation from './components/step2step-animation';

gsap.registerPlugin(useGSAP, Flip);

export default function ClientPage() {
  return (
    <div className="flip-container flex flex-1 flex-col gap-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-1">
        <div className="aspect-video bg-muted/50 flex items-center">
          <Step2stepAnimation />
        </div>
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video bg-muted/50"></div>
        <div className="aspect-video bg-muted/50" />
        <div className="aspect-video bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 bg-muted/50 md:min-h-min" />
    </div>
  );
}
