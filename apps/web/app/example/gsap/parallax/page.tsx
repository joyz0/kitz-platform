'use client';

import './style.scss';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Kody from './components/kody';

gsap.registerPlugin(useGSAP);

export default function ClientPage() {
  return (
    <div className="scroll-trigger-container flex flex-1 flex-col gap-4">
      <div className="min-h-[100vh] flex-1 bg-muted/50 md:min-h-min">
        <Kody />
      </div>
      <div className="min-h-[100vh] flex-1 bg-muted/50 md:min-h-min"></div>
      <div className="min-h-[100vh] flex-1 bg-muted/50 md:min-h-min"></div>
    </div>
  );
}
