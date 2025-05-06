'use client';

import './style.scss';
import gsap from 'gsap';
import FluidMove from './components/fluid-move';
import {
  StarscapeApp,
  Linescape1App,
  Linescape2App,
} from './components/interactive-backdrop';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function ClientPage() {
  return (
    <div className="canvas-container flex flex-1 flex-col gap-4">
      <div className="min-h-[100vh] flex-1 md:min-h-min">
        <FluidMove />
      </div>
      <div className="min-h-[100vh] flex-1 md:min-h-min">
        <StarscapeApp />
      </div>
      <div className="min-h-[100vh] flex-1 md:min-h-min">
        <Linescape1App />
      </div>
      <div className="min-h-[100vh] flex-1 md:min-h-min">
        <Linescape2App />
      </div>
    </div>
  );
}
