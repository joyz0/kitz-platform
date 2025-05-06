'use client';

import './2d.scss';
import { useEffect, useRef } from 'react';
import {
  WaterCanvas,
  WaterModel,
  RainMaker,
  create2DArray,
  createRadialCanvas,
} from './water-canvas';

export default function D2() {
  useEffect(() => {
    const pixel = create2DArray(createRadialCanvas(2, 2));
    const raindrop = create2DArray(createRadialCanvas(4, 4));
    const finger = create2DArray(createRadialCanvas(14, 14));

    const width = 400;
    const height = 300;

    const waterModel = new WaterModel(width, height, {
      resolution: 2.0,
      interpolate: false,
      damping: 0.985,
      clipping: 5,
      evolveThreshold: 0.05,
      maxFps: 50,
      showStats: true,
    });
    const waterCanvas = new WaterCanvas(
      width,
      height,
      'waterHolder',
      waterModel,
      {
        backgroundImageUrl: null,
        lightRefraction: 9.0,
        lightReflection: 0.1,
        showStats: true,
      }
    );
    // Init some utils
    const rainMaker = new RainMaker(width, height, waterModel, raindrop);
    rainMaker.setRaindropsPerSecond(1);
    const disableMouseInteraction = waterCanvas.enableMouseInteraction(
      waterModel,
      pixel,
      finger
    );
    return () => disableMouseInteraction();
  }, []);

  return <div id="waterHolder" className="ripples-container"></div>;
}
