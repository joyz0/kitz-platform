'use client';

import './style.scss';
import gsap from 'gsap';
import Starship from './components/starship';
import Mountain from './components/mountain';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function ClientPage() {
  return (
    <div className="scroll-trigger-container">
      <Mountain />
      <Starship />
    </div>
  );
}
