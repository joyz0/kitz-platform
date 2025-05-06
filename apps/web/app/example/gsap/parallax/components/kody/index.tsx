'use client';

import { RefObject, useEffect, useRef, useState } from 'react';
import './index.scss';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { motion } from 'framer-motion';

interface ParallaxConfig {
  coefficientX?: number;
  coefficientY?: number;
  rotate?: number;
  rotateX?: number;
  rotateY?: number;
}

export interface ParallaxItemConfig {
  positionX?: number;
  positionY?: number;
  positionZ?: number;
  rotate?: number;
  rotateX?: number;
  rotateY?: number;
  moveX?: number;
  moveY?: number;
  height?: number;
  width?: number;
}

interface ContainerCSS extends React.CSSProperties {
  '--r': number;
  '--rx': number;
  '--ry': number;
}

interface ItemCSS extends React.CSSProperties {
  '--x': number;
  '--y': number;
  '--z': number;
  '--r': number;
  '--rx': number;
  '--ry': number;
  '--mx': number;
  '--my': number;
  '--height': number;
  '--width': number;
}

const DEFAULT_CONFIG = {
  // Starting positions for X and Y
  positionX: 50,
  positionY: 50,
  positionZ: 0,
  // Range of movement in decimal where 1 === 100. Use negative for opposite directions.
  // Range of movement in decimal where 1 === 100. Use negative for opposite directions.
  rotate: 0,
  rotateX: 0,
  rotateY: 0,
  moveX: 0,
  moveY: 0,
};

type ProximityArgFn = () => number;
const useParallax = (
  callback: (x: number, y: number) => void,
  elementRef: RefObject<HTMLElement | null>,
  proximityArg: number | ProximityArgFn = 100
) => {
  useGSAP(
    (context, contextSafe) => {
      if (!elementRef.current || !callback) return;
      const UPDATE = contextSafe!(({ x, y }: { x: number; y: number }) => {
        const bounds = 100;
        const proximity =
          typeof proximityArg === 'function' ? proximityArg() : proximityArg;
        const elementBounds = elementRef.current!.getBoundingClientRect();
        const centerX = elementBounds.left + elementBounds.width / 2;
        const centerY = elementBounds.top + elementBounds.height / 2;
        const boundX = gsap.utils.mapRange(
          centerX - proximity,
          centerX + proximity,
          -bounds,
          bounds,
          x
        );
        const boundY = gsap.utils.mapRange(
          centerY - proximity,
          centerY + proximity,
          -bounds,
          bounds,
          y
        );
        callback(boundX / 100, boundY / 100);
      });
      window.addEventListener('pointermove', UPDATE);
      return () => {
        window.removeEventListener('pointermove', UPDATE);
      };
    },
    {
      scope: elementRef,
      dependencies: [callback, elementRef, proximityArg],
    }
  );
};

const Parallax = ({
  config,
  children,
}: {
  config: ParallaxConfig;
  children: React.ReactNode | React.ReactNode[];
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useParallax(
    (x, y) => {
      containerRef.current!.style.setProperty(
        '--range-x',
        `${Math.floor(gsap.utils.clamp(-60, 60, x * 100))}`
      );
      containerRef.current!.style.setProperty(
        '--range-y',
        `${Math.floor(gsap.utils.clamp(-60, 60, y * 100))}`
      );
    },
    containerRef,
    () => window.innerWidth * 0.5
  );

  return (
    <div
      ref={containerRef}
      className="parallax relative w-full h-full"
      style={
        {
          '--r': config.rotate,
          '--rx': config.rotateX,
          '--ry': config.rotateY,
        } as ContainerCSS
      }
    >
      {children}
    </div>
  );
};

Parallax.defaultProps = {
  config: {
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    coefficientX: 0.5,
    coefficientY: 0.5,
  },
};

const ParallaxItem = ({
  children,
  config,
}: {
  config: ParallaxItemConfig;
  children: React.ReactNode | React.ReactNode[];
}) => {
  const params = { ...DEFAULT_CONFIG, ...config };
  return (
    <div
      className="parallax__item absolute"
      style={
        {
          '--x': params.positionX,
          '--y': params.positionY,
          '--z': params.positionZ,
          '--r': params.rotate,
          '--rx': params.rotateX,
          '--ry': params.rotateY,
          '--mx': params.moveX,
          '--my': params.moveY,
          '--height': params.height,
          '--width': params.width,
        } as ItemCSS
      }
    >
      {children}
    </div>
  );
};

ParallaxItem.defaultProps = {
  config: DEFAULT_CONFIG,
};

const ParallaxWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="parallax__wrapper w-full h-full">{children}</div>
);

interface ParallaxItem {
  config: ParallaxItemConfig;
  backgroundPositionX: number;
  backgroundPositionY: number;
  size: number;
  identifier: string;
}

interface KodySegmentCSS extends React.CSSProperties {
  '--pos-x': number;
  '--pos-y': number;
  '--size': number;
}

const ITEMS = [
  {
    identifier: 'kody-yellow',
    backgroundPositionX: 53.15,
    backgroundPositionY: 50,
    size: 739,
    config: {
      positionX: 50,
      positionY: 54,
      moveX: 0.15,
      moveY: -0.25,
      height: 58,
      width: 55,
      rotate: 0.01,
    },
  },
  {
    identifier: 'kody-red',
    backgroundPositionX: 100,
    backgroundPositionY: 50,
    size: 739,
    config: {
      positionX: 50,
      positionY: 54,
      moveX: 0.15,
      moveY: -0.25,
      height: 58,
      width: 55,
      rotate: 0.01,
    },
  },
  {
    identifier: 'kody-white',
    backgroundPositionX: 68.8,
    backgroundPositionY: 50,
    size: 739,
    config: {
      positionX: 50,
      positionY: 54,
      moveX: 0.15,
      moveY: -0.25,
      height: 58,
      width: 55,
      rotate: 0.01,
    },
  },
  {
    identifier: 'kody-blue',
    backgroundPositionX: 84.4,
    backgroundPositionY: 50,
    size: 739,
    config: {
      positionX: 50,
      positionY: 54,
      moveX: 0.15,
      moveY: -0.25,
      height: 58,
      width: 55,
      rotate: 0.01,
    },
  },
  {
    identifier: 'battery',
    size: 2620,
    backgroundPositionX: -0.075,
    backgroundPositionY: 0,
    config: {
      positionX: 74,
      positionY: 15,
      positionZ: -1,
      moveX: 1.5,
      moveY: -0.85,
      height: 17,
      width: 17,
    },
  },
  {
    identifier: 'leaf-one',
    size: 10000,
    backgroundPositionX: 3.75,
    backgroundPositionY: -1,
    config: {
      positionX: 35,
      positionY: 94,
      moveX: 1.5,
      moveY: -0.85,
      height: 7,
      width: 4,
      rotate: 0.6,
    },
  },
  {
    identifier: 'leaf-two',
    size: 5800,
    backgroundPositionX: 10.15,
    backgroundPositionY: -0.25,
    config: {
      positionX: 97,
      positionY: 63,
      moveX: 1.5,
      moveY: -0.85,
      height: 4,
      width: 8,
      rotate: -0.5,
    },
  },
  {
    identifier: 'leaf-three',
    size: 8000,
    backgroundPositionX: 8.85,
    backgroundPositionY: -0.5,
    config: {
      positionX: 84,
      positionY: 21,
      moveX: 1.5,
      moveY: -0.85,
      height: 7,
      width: 6,
      rotate: 0.75,
    },
  },
  {
    identifier: 'leaf-four',
    size: 13500,
    backgroundPositionX: 19.125,
    backgroundPositionY: -0.5,
    config: {
      positionX: 57,
      positionY: 18,
      moveX: 1.5,
      moveY: -0.85,
      height: 7,
      width: 3,
      rotate: 0.35,
    },
  },
  {
    identifier: 'leaf-five',
    size: 6500,
    backgroundPositionX: 16,
    backgroundPositionY: -1,
    config: {
      positionX: 55,
      positionY: 94,
      moveX: 1.5,
      moveY: -0.85,
      height: 10,
      width: 6,
      rotate: 0.6,
    },
  },
  {
    identifier: 'leaf-six',
    size: 5000,
    backgroundPositionX: 14,
    backgroundPositionY: -0.5,
    config: {
      positionX: 9,
      positionY: 22,
      moveX: 1.5,
      moveY: -0.85,
      height: 8,
      width: 8,
      rotate: 1,
    },
  },
  {
    identifier: 'leaf-seven',
    size: 5100,
    backgroundPositionX: 11.975,
    backgroundPositionY: -0.5,
    config: {
      positionX: 4,
      positionY: 83,
      moveX: 1.5,
      moveY: -0.85,
      height: 8,
      width: 8,
      rotate: -0.5,
    },
  },
  {
    identifier: 'leaf-eight',
    size: 5000,
    backgroundPositionX: 20.15,
    backgroundPositionY: -0.5,
    config: {
      positionX: 10,
      positionY: 74,
      moveX: 1.5,
      moveY: -0.85,
      height: 5,
      width: 8,
      rotate: 0.25,
    },
  },
  {
    identifier: 'leaf-nine',
    size: 5000,
    backgroundPositionX: 4.8,
    backgroundPositionY: -0.25,
    config: {
      positionX: 83,
      positionY: 64,
      moveX: 1.5,
      moveY: -0.85,
      height: 9,
      width: 9,
      rotate: -0.6,
    },
  },
  {
    identifier: 'leaf-ten',
    size: 5000,
    backgroundPositionX: 6.85,
    backgroundPositionY: 0,
    config: {
      positionX: 56,
      positionY: 4,
      moveX: 1.5,
      moveY: -0.85,
      height: 8,
      width: 8,
      rotate: 0.8,
    },
  },
  {
    identifier: 'leaf-eleven',
    size: 6200,
    backgroundPositionX: 17.65,
    backgroundPositionY: -0.5,
    config: {
      positionX: 28,
      positionY: 32,
      moveX: 1.5,
      moveY: -0.85,
      height: 4,
      width: 8,
      rotate: 0.6,
    },
  },
  {
    identifier: 'one-wheel',
    size: 1250,
    backgroundPositionX: 27.5,
    backgroundPositionY: -8,
    config: {
      positionX: 80,
      positionY: 83,
      positionZ: 2,
      rotate: 0.2,
      moveX: 1.5,
      moveY: -0.85,
      height: 26,
      width: 32,
    },
  },
  {
    identifier: 'speaker',
    size: 2150,
    backgroundPositionX: 35,
    backgroundPositionY: 0,
    config: {
      positionX: 12,
      positionY: 51,
      positionZ: 2,
      moveX: 1.5,
      moveY: -0.85,
      height: 24,
      width: 19,
    },
  },
  {
    identifier: 'skis',
    size: 1240,
    backgroundPositionX: 41.3,
    backgroundPositionY: -2,
    config: {
      positionX: 77,
      positionY: 40,
      positionZ: 10,
      moveX: 1.5,
      moveY: -0.85,
      height: 30,
      width: 30,
    },
  },
  {
    identifier: 'recycle',
    size: 2850,
    backgroundPositionX: 22.55,
    backgroundPositionY: 0,
    config: {
      positionX: 28,
      positionY: 11,
      rotate: -2,
      moveX: 1.5,
      moveY: -0.85,
      height: 15,
      width: 15,
    },
  },
];

const KodyParallax = ({ team = 'white' }: { team: string }) => (
  <motion.div
    initial={{ scale: 1.5, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.75 }}
    className="w-full"
  >
    <ParallaxWrapper>
      <Parallax
        config={{
          rotate: 0.01,
          rotateX: 0.1,
          rotateY: 0.25,
          coefficientX: 0.75,
          coefficientY: 0.75,
        }}
      >
        {/* Debug image. Uncomment to match up positions in DevTools */}
        {/* <img style={{
            position: 'absolute',
            width: '100%',
            objectFit: 'cover',
            zIndex: 2,
            opacity: 0.5,
          }} src="https://res.cloudinary.com/kentcdodds-com/image/upload/kentcdodds.com/illustrations/kody-flying_blue.png"/> */}
        {ITEMS.filter(
          (item) =>
            item.identifier === `kody-${team}` ||
            !item.identifier.includes('kody')
        ).map((item: ParallaxItem) => (
          <ParallaxItem key={item.identifier} config={item.config}>
            <div
              className="kody-segment"
              style={
                {
                  '--pos-x': item.backgroundPositionX,
                  '--pos-y': item.backgroundPositionY,
                  '--size': item.size,
                } as KodySegmentCSS
              }
            />
          </ParallaxItem>
        ))}
      </Parallax>
    </ParallaxWrapper>
  </motion.div>
);

const OPTIONS = ['white', 'red', 'yellow', 'blue'];
const AUDIO =
  typeof Audio === 'undefined'
    ? { play() {} }
    : new Audio('https://assets.codepen.io/605876/sparkle.mp3');
const App = () => {
  const [selected, setSelected] = useState(OPTIONS[0]);
  const [motion, setMotion] = useState(1);

  useEffect(() => {
    document.documentElement.style.setProperty('--allow-motion', `${motion}`);
  }, [motion]);

  return (
    <div className="kody-container">
      <div className="scene">
        <KodyParallax team={selected} />
        <div className="flex align-center items-center justify-center mt-4 font-bold">
          <label className="text-white mr-4" htmlFor="motion">
            Motion
          </label>
          <input
            type="range"
            id="motion"
            value={motion}
            min="0"
            max="1"
            step="0.1"
            onChange={(e) => setMotion(Number(e.target.value))}
          />
        </div>
        <div className="flex align-center items-center justify-center mt-6 font-bold">
          <label htmlFor="select" className="text-white mr-4">
            Choose team:
          </label>
          <select
            id="select"
            value={selected}
            onChange={(e) => {
              setSelected(e.target.value);
              AUDIO.play();
            }}
          >
            {OPTIONS.map((opt) => (
              <option value={opt} key={opt}>
                {`${opt.charAt(0).toUpperCase()}${opt.slice(1)}`}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default App;
