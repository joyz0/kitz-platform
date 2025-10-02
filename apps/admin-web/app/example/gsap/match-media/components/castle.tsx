'use client';

import { useRef } from 'react';
import './castle.scss';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Example() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    (context, contextSafe) => {
      const assetVerticalBreakPoints = [
        {
          selector: '.blason',
          large: {
            scale: 1,
            transformOrigin: 'center bottom',
            duration: 0.3,
          },
          medium: {
            scale: 1,
            transformOrigin: 'center bottom',
            duration: 0.3,
          },
          narrow: {
            scale: 0.5,
            transformOrigin: 'center bottom',
            duration: 0.3,
          },
        },
        {
          selector: '.small-tower',
          large: {
            y: 0,
            duration: 0.3,
          },
          medium: {
            y: 300,
            duration: 0.3,
          },
          narrow: {
            y: 300,
            duration: 0.3,
          },
        },
        {
          selector: '.big-tower',
          large: {
            y: 0,
            duration: 0.3,
          },
          medium: {
            y: 0,
            duration: 0.3,
          },
          narrow: {
            y: 200,
            duration: 0.3,
          },
        },
        {
          selector: '.house',
          large: {
            y: 0,
            duration: 0.3,
          },
          medium: {
            y: 120,
            duration: 0.3,
          },
          narrow: {
            y: 400,
            duration: 0.3,
          },
        },
        {
          selector: '.tree',
          large: {
            y: 0,
            duration: 0.3,
          },
          medium: {
            y: 150,
            duration: 0.3,
          },
          narrow: {
            y: 400,
            duration: 0.3,
          },
        },
        {
          selector: '.one',
          large: {
            y: 0,
            duration: 0.3,
          },
          medium: {
            y: 100,
            duration: 0.3,
          },
          narrow: {
            y: 300,
            duration: 0.3,
          },
        },
        {
          selector: '.big-tower-left',
          large: {
            y: 0,
            duration: 0.3,
          },
          medium: {
            y: 400,
            duration: 0.3,
          },
          narrow: {
            y: 400,
            duration: 0.3,
          },
        },
        {
          selector: '.big-tower-left-2',
          large: {
            y: 0,
            duration: 0.3,
          },
          medium: {
            y: -60,
            duration: 0.3,
          },
          narrow: {
            y: 190,
            duration: 0.3,
          },
        },
        {
          selector: '.double-tower-left',
          large: {
            y: 0,
            duration: 0.3,
          },
          medium: {
            y: 90,
            duration: 0.3,
          },
          narrow: {
            y: 90,
            duration: 0.3,
          },
        },
        {
          selector: '.double-tower-center',
          large: {
            y: 0,
            duration: 0.3,
          },
          medium: {
            y: 250,
            duration: 0.3,
          },
          narrow: {
            y: 400,
            duration: 0.3,
          },
        },
        {
          selector: '.tower-left, .tower-right',
          large: {
            y: 0,
            duration: 0.3,
          },
          medium: {
            y: 0,
            duration: 0.3,
          },
          narrow: {
            y: 110,
            duration: 0.3,
          },
        },
        {
          selector: '.tower-roof-left, .tower-roof-right',
          large: {
            y: 0,
            duration: 0.3,
          },
          medium: {
            y: 0,
            duration: 0.3,
          },
          narrow: {
            y: 60,
            duration: 0.3,
          },
        },
        {
          selector: '.top-back, .roof-tower-side, .tower-windows',
          large: {
            opacity: 1,
            duration: 0.3,
          },
          medium: {
            opacity: 1,
            duration: 0.3,
          },
          narrow: {
            opacity: 0,
            duration: 0.3,
          },
        },
        {
          selector: '.horizontal-bottom-general',
          large: {
            y: 0,
            duration: 0.3,
          },
          medium: {
            y: -160,
            duration: 0.3,
          },
          narrow: {
            y: -280,
            duration: 0.3,
          },
        },
        {
          selector: '.horizontal-bottom-1',
          large: {
            y: 0,
            duration: 0.3,
          },
          medium: {
            y: -120,
            duration: 0.3,
          },
          narrow: {
            y: -210,
            duration: 0.3,
          },
        },
      ];
      const assetHorizontalBreakPoints = [
        {
          selector: '.tree-right, .tree-right-2',
          large: {
            x: 0,
            rotate: 0,
            transformOrigin: 'center',
            opacity: 1,
            duration: 0.3,
          },
          medium: {
            x: -240,
            rotate: -5,
            transformOrigin: 'center',
            opacity: 1,
            duration: 0.3,
          },
          narrow: {
            x: -240,
            rotate: -5,
            transformOrigin: 'center',
            opacity: 0,
            duration: 0.3,
          },
        },
        {
          selector: '.tree-left, .tree-left-2',
          large: {
            x: 0,
            rotate: 0,
            transformOrigin: 'center',
            opacity: 1,
            duration: 0.3,
          },
          medium: {
            x: 240,
            rotate: 5,
            transformOrigin: 'center',
            opacity: 1,
            duration: 0.3,
          },
          narrow: {
            x: 240,
            rotate: 5,
            transformOrigin: 'center',
            opacity: 0,
            duration: 0.3,
          },
        },
        {
          selector: '.light-radius',
          large: {
            y: 0,
            duration: 0.3,
          },
          medium: {
            y: 0,
            duration: 0.3,
          },
          narrow: {
            y: 50,
            duration: 0.3,
          },
        },
        {
          selector: '.main-castle-center',
          large: {
            opacity: 1,
            duration: 0,
          },
          medium: {
            opacity: 1,
            duration: 0,
          },
          narrow: {
            opacity: 0,
            duration: 0,
          },
        },
        {
          selector: '.big-tower-left',
          large: {
            x: 0,
            duration: 0.3,
          },
          medium: {
            x: 0,
            duration: 0.3,
          },
          narrow: {
            x: 300,
            duration: 0.3,
          },
        },
        {
          selector: '.torsh',
          large: {
            opacity: 1,
            duration: 0,
          },
          medium: {
            opacity: 1,
            duration: 0,
          },
          narrow: {
            opacity: 0,
            duration: 0,
          },
        },
        {
          selector: '.one',
          large: {
            opacity: 1,
            duration: 0.3,
          },
          medium: {
            opacity: 1,
            duration: 0.3,
          },
          narrow: {
            opacity: 0,
            duration: 0.3,
          },
        },
        {
          selector: '.two',
          large: {
            x: 0,
            duration: 0.3,
          },
          medium: {
            x: 334,
            duration: 0.3,
          },
          narrow: {
            x: 334,
            duration: 0.3,
          },
        },
        {
          selector: '.tree',
          large: {
            x: 0,
            opacity: 1,
            duration: 0.3,
          },
          medium: {
            x: 60,
            opacity: 1,
            duration: 0.3,
          },
          narrow: {
            x: 60,
            opacity: 0,
            duration: 0.3,
          },
        },
        {
          selector: '.four',
          large: {
            x: 0,
            duration: 0.3,
          },
          medium: {
            x: -130,
            duration: 0.3,
          },
          narrow: {
            x: -350,
            duration: 0.3,
          },
        },
        {
          selector: '.inner-small-tower',
          large: {
            y: 0,
            duration: 0.3,
          },
          medium: {
            y: 0,
            duration: 0.3,
          },
          narrow: {
            y: 450,
            duration: 0.3,
          },
        },
        {
          selector: '.inner-house',
          large: {
            x: 0,
            y: 0,
            transformOrigin: 'center bottom',
            transform: 'scale(1)',
            duration: 0.3,
          },
          medium: {
            x: -180,
            y: 0,
            transformOrigin: 'center bottom',
            transform: 'scale(1)',
            duration: 0.3,
          },
          narrow: {
            x: -280,
            y: 0,
            transformOrigin: 'center bottom',
            transform: 'scale(0.6)',
            duration: 0.3,
          },
        },
        {
          selector: '.inner-big-tower',
          large: {
            x: 0,
            y: 0,
            transformOrigin: 'center top',
            transform: 'scale(1)',
            duration: 0.3,
          },
          medium: {
            x: -180,
            y: 0,
            transformOrigin: 'center top',
            transform: 'scale(1)',
            duration: 0.3,
          },
          narrow: {
            x: -280,
            y: 0,
            transformOrigin: 'center top',
            transform: 'scale(0.6)',
            duration: 0.3,
          },
        },
        {
          selector: '.wall-right',
          large: {
            x: 0,
            opacity: 1,
            duration: 0.3,
          },
          medium: {
            x: -235,
            opacity: 1,
            duration: 0.3,
          },
          narrow: {
            x: -235,
            opacity: 0,
            duration: 0.3,
          },
        },
        {
          selector: '.wall-left',
          large: {
            x: 0,
            opacity: 1,
            duration: 0.3,
          },
          medium: {
            x: 235,
            opacity: 0,
            duration: 0.3,
          },
          narrow: {
            x: 235,
            opacity: 0,
            duration: 0.3,
          },
        },
        {
          selector: '.tower-roof-left, .left-roof-tower-base',
          large: {
            x: 0,
            duration: 0.3,
          },
          medium: {
            x: 360,
            duration: 0.3,
          },
          narrow: {
            x: 360,
            duration: 0.3,
          },
        },
        {
          selector: '.tower-left, .left-tower-base',
          large: {
            x: 0,
            opacity: 1,
            duration: 0.3,
          },
          medium: {
            x: 0,
            opacity: 1,
            duration: 0.3,
          },
          narrow: {
            x: 200,
            opacity: 0,
            duration: 0.3,
          },
        },
        {
          selector: '.tower-roof-right, .right-roof-tower-base',
          large: {
            x: 0,
            duration: 0.3,
          },
          medium: {
            x: -360,
            duration: 0.3,
          },
          narrow: {
            x: -360,
            duration: 0.3,
          },
        },
        {
          selector: '.tower-right, .right-tower-base',
          large: {
            x: 0,
            opacity: 1,
            duration: 0.3,
          },
          medium: {
            x: 0,
            opacity: 1,
            duration: 0.3,
          },
          narrow: {
            x: -200,
            opacity: 0,
            duration: 0.3,
          },
        },
        {
          selector: '.double-tower-left',
          large: {
            x: 0,
            scale: 1,
            transformOrigin: 'center',
            duration: 0.3,
          },
          medium: {
            x: 180,
            scale: 1,
            transformOrigin: 'center',
            duration: 0.3,
          },
          narrow: {
            x: 350,
            scale: 0.8,
            transformOrigin: 'center',
            duration: 0.3,
          },
        },
        {
          selector: '.double-tower-center',
          large: {
            x: 0,
            duration: 0.3,
          },
          medium: {
            x: 103,
            duration: 0.3,
          },
          narrow: {
            x: 103,
            duration: 0.3,
          },
        },
        {
          selector: '.big-tower-left-2',
          large: {
            x: 0,
            duration: 0.3,
          },
          medium: {
            x: 150,
            duration: 0.3,
          },
          narrow: {
            x: 220,
            duration: 0.3,
          },
        },
      ];

      function applySVGResponsiveness_horizontal(width: number) {
        assetHorizontalBreakPoints.forEach((asset) => {
          if (width < 360) {
            gsap.to(asset.selector, asset.narrow);
          } else if (width < 620) {
            gsap.to(asset.selector, asset.medium);
          } else {
            gsap.to(asset.selector, asset.large);
          }
        });
      }

      function applySVGResponsiveness_vertical(height: number) {
        assetVerticalBreakPoints.forEach((asset) => {
          if (height < 300) {
            gsap.to(asset.selector, asset.narrow);
          } else if (height < 485) {
            gsap.to(asset.selector, asset.medium);
          } else {
            gsap.to(asset.selector, asset.large);
          }
        });
      }

      const draw = document.getElementById('draw')!;

      const resize = contextSafe!(() => {
        draw.setAttribute(
          'style',
          'width:' +
            window.innerWidth +
            'px;height:' +
            window.innerHeight +
            'px;'
        );

        applySVGResponsiveness_horizontal(draw.offsetWidth);
        applySVGResponsiveness_vertical(draw.offsetHeight);
      });

      window.addEventListener('resize', resize);

      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const cr = entry.contentRect;
          applySVGResponsiveness_horizontal(cr.width);
          applySVGResponsiveness_vertical(cr.height);
        }
      });
      ro.observe(document.getElementById('draw')!);

      window.onload = function () {
        gsap.to('#fade', {
          opacity: 0,
          duration: 5,
        });
      };

      const handleMouseDown = contextSafe!(() => {
        gsap.to('#instructions', {
          opacity: 0,
          duration: 0.4,
        });
      });

      document.addEventListener('mousedown', handleMouseDown);

      return () => {
        window.removeEventListener('resize', resize);
        document.removeEventListener('mousedown', handleMouseDown);
      };
    },
    { scope: container }
  );

  return (
    <div ref={container} className="castle-container">
      <div
        id="fade"
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          width: '100vw',
          height: '100vh',
          top: 0,
          left: 0,
          background: 'black',
          opacity: 0.1,
          zIndex: 9,
        }}
      ></div>
      <div id="draw">
        <div id="resize">
          <div>
            <div id="instructions">
              <span>RESIZE SCENE</span>

              <svg id="arrow" width="90" height="72" viewBox="0 0 90 72">
                <path
                  style={{ fill: '#13b4e5' }}
                  d="M72.2,20.18c-.57,5.18-1.25,8.66-2.34,11.15A69.47,69.47,0,0,0,60,26.12a50.77,50.77,0,0,0-16.6-4.41,35.12,35.12,0,0,0-16.81,2.91,44.7,44.7,0,0,0-13.48,9.63l.66.74a42.93,42.93,0,0,1,13.85-7.65,31.32,31.32,0,0,1,15.18-.85A45.24,45.24,0,0,1,57,32.12,58.37,58.37,0,0,1,64.12,37c-3.2,1.46-7.72,2.53-14.28,4.83l0,3c9,.08,18-1.13,26.91-2.5.19-7.49.1-15.06-1.73-22.38Z"
                />
              </svg>
            </div>
          </div>
        </div>

        <svg
          id="scene"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 1920 1080"
        >
          <defs>
            <linearGradient
              id="sky"
              x1="961.62"
              y1="1081.36"
              x2="961.62"
              y2="1.36"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#e8137e"></stop>
              <stop offset="1" stopColor="#120463"></stop>
            </linearGradient>
          </defs>
          <g className="sky">
            <rect width="1920" height="1080" style={{ fill: 'url(#sky)' }} />
          </g>
          <g className="stars" style={{ opacity: 0.7000000000000001 }}>
            <g className="stars-2" data-name="stars">
              <g style={{ opacity: 0.277595035439361 }}>
                <circle
                  cx="72.95"
                  cy="43.88"
                  r="4.15"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.325750913893254 }}>
                <circle
                  cx="49.3"
                  cy="44.3"
                  r="3.74"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.565807421840206 }}>
                <circle
                  cx="15.93"
                  cy="84.79"
                  r="2.99"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.37414605214159 }}>
                <circle
                  cx="57.28"
                  cy="161.53"
                  r="2.42"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.812281778605826 }}>
                <circle
                  cx="41.61"
                  cy="235.13"
                  r="2.75"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <circle
                cx="9.56"
                cy="308.05"
                r="2.75"
                style={{ fill: '#efefbf' }}
              />
              <g style={{ opacity: 0.457970255796699 }}>
                <circle
                  cx="10.7"
                  cy="388.1"
                  r="2.75"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.160384779396265 }}>
                <circle
                  cx="38.54"
                  cy="442.84"
                  r="2.75"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.11476820801767 }}>
                <circle
                  cx="58.16"
                  cy="462.13"
                  r="3.34"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.124022074355704 }}>
                <circle
                  cx="70.49"
                  cy="477.4"
                  r="3.98"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.180389451798874 }}>
                <circle
                  cx="109.56"
                  cy="493.1"
                  r="5.49"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.168691938926053 }}>
                <circle
                  cx="174.98"
                  cy="525.58"
                  r="3.91"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.758924346916585 }}>
                <circle
                  cx="241.7"
                  cy="467.53"
                  r="4.33"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.344529667470351 }}>
                <circle
                  cx="275.57"
                  cy="318.37"
                  r="3.54"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <circle
                cx="288.57"
                cy="201.02"
                r="2.83"
                style={{ fill: '#efefbf' }}
              />
              <g style={{ opacity: 0.402707697699135 }}>
                <circle
                  cx="273.62"
                  cy="129.03"
                  r="3.18"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.255890667408369 }}>
                <circle
                  cx="365.12"
                  cy="70.93"
                  r="3.57"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.299427442256248 }}>
                <circle
                  cx="421.12"
                  cy="118.53"
                  r="4.21"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <circle
                cx="421.91"
                cy="283.85"
                r="2.67"
                style={{ fill: '#efefbf' }}
              />
              <circle
                cx="438.65"
                cy="351.34"
                r="1.93"
                style={{ fill: '#efefbf' }}
              />
              <g style={{ opacity: 0.613065766479503 }}>
                <circle
                  cx="631.94"
                  cy="247.09"
                  r="2.75"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.416060699355363 }}>
                <circle
                  cx="786.24"
                  cy="133.58"
                  r="3.36"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.42027904468132 }}>
                <circle
                  cx="899.26"
                  cy="133.71"
                  r="1.49"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.515982773206423 }}>
                <circle
                  cx="1097.75"
                  cy="170.75"
                  r="2.79"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.27225447788998 }}>
                <circle
                  cx="1546.42"
                  cy="155.81"
                  r="2.75"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.211434637553776 }}>
                <circle
                  cx="1772.1"
                  cy="119.08"
                  r="3.5"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.889276764565972 }}>
                <circle
                  cx="1917.25"
                  cy="119.64"
                  r="2.75"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.346501238050084 }}>
                <circle
                  cx="1868.65"
                  cy="316.69"
                  r="2.75"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.589635936375129 }}>
                <circle
                  cx="1832.13"
                  cy="374.58"
                  r="2.75"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.484985976941031 }}>
                <circle
                  cx="1750.65"
                  cy="417.25"
                  r="2.75"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.541770508753047 }}>
                <circle
                  cx="1616.45"
                  cy="447.91"
                  r="2.75"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.7567862166518 }}>
                <circle
                  cx="1561.41"
                  cy="477.18"
                  r="3.48"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.635774917117411 }}>
                <circle
                  cx="1460.29"
                  cy="555.95"
                  r="3.32"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.590522857614012 }}>
                <circle
                  cx="1452.6"
                  cy="568.4"
                  r="3.01"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <circle
                cx="1186.89"
                cy="406.19"
                r="2.99"
                style={{ fill: '#efefbf' }}
              />
              <g style={{ opacity: 0.197495326829206 }}>
                <circle
                  cx="1052.64"
                  cy="378.68"
                  r="4.52"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <circle
                cx="888.42"
                cy="377.18"
                r="2.75"
                style={{ fill: '#efefbf' }}
              />
              <circle
                cx="687.06"
                cy="404.23"
                r="2.75"
                style={{ fill: '#efefbf' }}
              />
              <circle
                cx="589.38"
                cy="461.24"
                r="2.75"
                style={{ fill: '#efefbf' }}
              />
              <g style={{ opacity: 0.705730471057717 }}>
                <circle
                  cx="452.87"
                  cy="519.86"
                  r="2.75"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.524726826618837 }}>
                <circle
                  cx="323.77"
                  cy="690.95"
                  r="3.53"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.419985822644295 }}>
                <circle
                  cx="279.43"
                  cy="700.43"
                  r="3.48"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.443559807675169 }}>
                <circle
                  cx="327.22"
                  cy="420.71"
                  r="3.61"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.315755858170207 }}>
                <circle
                  cx="379.22"
                  cy="325.01"
                  r="3.27"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <circle
                cx="429.23"
                cy="247.09"
                r="2.77"
                style={{ fill: '#efefbf' }}
              />
              <g style={{ opacity: 0.104987988099219 }}>
                <circle
                  cx="519.18"
                  cy="140.87"
                  r="5.38"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.202913773616705 }}>
                <circle
                  cx="587.79"
                  cy="95.74"
                  r="4.97"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.411795798361377 }}>
                <circle
                  cx="769.85"
                  cy="35.61"
                  r="5.12"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.761941990123419 }}>
                <circle
                  cx="897.92"
                  cy="19.69"
                  r="2.37"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.384652628469805 }}>
                <circle
                  cx="1242.23"
                  cy="20.3"
                  r="2.75"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.499155900151065 }}>
                <circle
                  cx="1392.09"
                  cy="13.81"
                  r="2.75"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.208992307367029 }}>
                <circle
                  cx="1533.57"
                  cy="13.98"
                  r="2.75"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <circle
                cx="1625.12"
                cy="16.98"
                r="2.75"
                style={{ fill: '#efefbf' }}
              />
              <g style={{ opacity: 0.626391871117238 }}>
                <circle
                  cx="1600.1"
                  cy="70.47"
                  r="2.75"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.518364144209206 }}>
                <circle
                  cx="1415.28"
                  cy="163.28"
                  r="3.58"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.261954673564098 }}>
                <circle
                  cx="1261.41"
                  cy="202.46"
                  r="2.75"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.606793964601258 }}>
                <circle
                  cx="1063"
                  cy="270.26"
                  r="3.01"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.139994498030557 }}>
                <circle
                  cx="998.94"
                  cy="312.45"
                  r="4.74"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <circle
                cx="1151.05"
                cy="330.12"
                r="2.75"
                style={{ fill: '#efefbf' }}
              />
              <g style={{ opacity: 0.442107434892553 }}>
                <circle
                  cx="1475.78"
                  cy="301.08"
                  r="4.65"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.285844629379034 }}>
                <circle
                  cx="1594.74"
                  cy="274.5"
                  r="4.74"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.334368420996644 }}>
                <circle
                  cx="1643.91"
                  cy="268.03"
                  r="4.24"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.545408877318136 }}>
                <circle
                  cx="1437.01"
                  cy="313.58"
                  r="3.28"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.192676639537843 }}>
                <circle
                  cx="1072.84"
                  cy="356.4"
                  r="4.2"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <circle
                cx="846.84"
                cy="357.26"
                r="2.75"
                style={{ fill: '#efefbf' }}
              />
              <circle
                cx="685.68"
                cy="357.12"
                r="2.75"
                style={{ fill: '#efefbf' }}
              />
              <g style={{ opacity: 0.49902474028636 }}>
                <circle
                  cx="583.66"
                  cy="337.24"
                  r="2.75"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <circle
                cx="485.6"
                cy="319.58"
                r="1.94"
                style={{ fill: '#efefbf' }}
              />
              <g style={{ opacity: 0.107338954113952 }}>
                <circle
                  cx="318.97"
                  cy="374.73"
                  r="4.51"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.318886623460542 }}>
                <circle
                  cx="147.21"
                  cy="485.59"
                  r="4.47"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.260634421904909 }}>
                <circle
                  cx="76.78"
                  cy="566.06"
                  r="4.2"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.215547514525137 }}>
                <circle
                  cx="40.05"
                  cy="637.89"
                  r="3.62"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.303587813489648 }}>
                <circle
                  cx="56.09"
                  cy="681.93"
                  r="3.89"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <circle
                cx="329.98"
                cy="784.06"
                r="2.75"
                style={{ fill: '#efefbf' }}
              />
              <circle
                cx="513.82"
                cy="747.93"
                r="2.75"
                style={{ fill: '#efefbf' }}
              />
              <circle
                cx="748.95"
                cy="566.29"
                r="2.75"
                style={{ fill: '#efefbf' }}
              />
              <circle
                cx="1189.93"
                cy="603.56"
                r="2.75"
                style={{ fill: '#efefbf' }}
              />
              <circle
                cx="1356.19"
                cy="613.64"
                r="2.75"
                style={{ fill: '#efefbf' }}
              />
              <g style={{ opacity: 0.148610002175251 }}>
                <circle
                  cx="1473.33"
                  cy="630.42"
                  r="3.79"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.173314836730801 }}>
                <circle
                  cx="1540.01"
                  cy="650.41"
                  r="3.8"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.768312240531127 }}>
                <circle
                  cx="1621.96"
                  cy="675.01"
                  r="3.47"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.326470511413166 }}>
                <circle
                  cx="1689.41"
                  cy="605.53"
                  r="2.75"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.181823445276986 }}>
                <circle
                  cx="1650.13"
                  cy="354.39"
                  r="3.9"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.314848235088404 }}>
                <circle
                  cx="1542.1"
                  cy="170.72"
                  r="2.67"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.231252622812415 }}>
                <circle
                  cx="1394.73"
                  cy="99.18"
                  r="3.91"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.188431667918274 }}>
                <circle
                  cx="967.6"
                  cy="80.26"
                  r="1.65"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.105397223680777 }}>
                <circle
                  cx="757.38"
                  cy="81.04"
                  r="5.61"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.298834387320642 }}>
                <circle
                  cx="595.55"
                  cy="65.38"
                  r="3.85"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.166271503835047 }}>
                <circle
                  cx="433.27"
                  cy="62.97"
                  r="3.98"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.355843654517834 }}>
                <circle
                  cx="309.26"
                  cy="63.1"
                  r="2.75"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.065965826435126 }}>
                <circle
                  cx="184.41"
                  cy="67.17"
                  r="4.26"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.149475404879551 }}>
                <circle
                  cx="116.71"
                  cy="103.99"
                  r="6.41"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.189498158953082 }}>
                <circle
                  cx="131.08"
                  cy="182.26"
                  r="3.96"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.216488845579902 }}>
                <circle
                  cx="170.91"
                  cy="185.16"
                  r="4.5"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <g style={{ opacity: 0.292759150748337 }}>
                <circle
                  cx="197.99"
                  cy="183.13"
                  r="3.96"
                  style={{ fill: '#efefbf' }}
                />
              </g>
              <circle
                cx="139.23"
                cy="285.26"
                r="2.07"
                style={{ fill: '#efefbf' }}
              />
              <circle
                cx="146.88"
                cy="286.17"
                r="2.04"
                style={{ fill: '#efefbf' }}
              />
            </g>
          </g>
          <g className="back-towers">
            <path
              className="four"
              d="M1393.39,630.22c-16.52-23.49-37.19-84.7-37-87.42-14.53,46.28-19.91,70.24-37.39,87.42a44.38,44.38,0,0,1,7.45-2.59c0,1.63,0,4.82,0,6.41l8.35,14.66c1.61,49.4,1.61,173.46,0,222.86H1378c-2.1-53.17-2.76-174.52,0-222.86l8.35-14.66c0-1.5,0-4.67,0-6.18A64,64,0,0,1,1393.39,630.22Z"
              style={{ fill: '#1d3d6b', opacity: 0.8 }}
            />
            <path
              className="tree"
              d="M1194.59,240.25c-30.8-43.81-69.35-157.94-69-163-27.09,86.31-37.13,131-69.73,163a82.51,82.51,0,0,1,13.88-4.82c0,3,0,9,0,11.95l15.58,27.33c3,92.13,3,522.07,0,614.2H1166c-3.91-99.15-5.15-524,0-614.2l15.58-27.33c0-2.8,0-8.72,0-11.53A121.92,121.92,0,0,1,1194.59,240.25Z"
              style={{ fill: '#1d3d6b', opacity: 0.8 }}
            />
            <path
              className="two"
              d="M556.23,532.68c-8.9-12.65-20-45.62-19.94-47.09-7.83,24.93-10.73,37.84-20.14,47.09a23.46,23.46,0,0,1,4-1.39v3.45l4.5,7.9c.87,26.61,0,343.7,0,343.7H548s-1.49-317.66,0-343.7l4.5-7.9c0-.81,0-2.52,0-3.33A36.21,36.21,0,0,1,556.23,532.68Z"
              style={{ fill: '#1d3d6b', opacity: 0.8 }}
            />
            <path
              className="one"
              d="M1029.59,396.13c-2.64-3.78-5.12-7.71-7.5-11.69h0c-3.61-6.05-7.1-12.5-10.35-18.83-7.44-1.43-15.29-2.52-23.37-3.3,0-10,0-36.12,0-45.77l13-22.73v-4.06c5.94-.68,9.9-1.35,10.87-1.87-25.66-36.54-57.64-131.23-57.41-135.58l-.3.95v0c-16.39,46.14-22.94,98.2-57.71,134.65a65.14,65.14,0,0,0,11.55,2.68c-2.09,2.06,12.21,23.92,12.95,26v46.64c-6.67.82-13.19,1.85-19.74,3.1-1.15,2-2.34,3.86-3.56,5.76h0a138.05,138.05,0,0,1-19.49,24.09,77.34,77.34,0,0,1,9.45-3.62l-9.45,3.62a85.32,85.32,0,0,0,15.12,3.5v4.27l17,29.75c3.28,100.33,3.28,375.71,0,476H998.4c-4-99.54-5.31-375.24-1-457.3l0,0q.47-9.43,1-18.75l17-29.75v-5.33C1023.13,397.69,1028.32,396.81,1029.59,396.13Z"
              style={{ fill: '#1d3d6b', opacity: 0.8 }}
            />
          </g>
          <g className="house">
            <g className="inner-house">
              <path
                className="house-2"
                data-name="house"
                d="M1305.08,327q16.15-1.53,32.5-3.85h0c-39.76-64.27-72.58-126.22-96.51-185.19-25,57.49-58.58,120.07-96.51,185.19h0q16,2.36,32.27,3.93c3.52,35.69,2.33,75-1.3,116.24H1306.6C1302.56,401.47,1301,362.07,1305.08,327Z"
                style={{ fill: '#00246b' }}
              />
              <g className="shad-grp" style={{ opacity: 0.7000000000000001 }}>
                <path
                  className="roof-back"
                  d="M1144.56,323.13c62,9.13,126.21,9.48,193,0L1245.32,252Z"
                  style={{ fill: '#040433' }}
                />
                <path
                  className="wall"
                  d="M1306.6,443.3H1175.53c4-45.65,5.07-89,0-127.66H1306.6C1300.68,353.48,1302.12,396.91,1306.6,443.3Z"
                  style={{ fill: '#4f4e4f' }}
                />
                <path
                  className="shadow"
                  d="M1306.6,315.64H1175.53c.85,6.42,1.5,13,2,19.65,47-18.44,105.59-12.82,105.59,18.82,0,23.51-1,56.49-2.29,89.19h25.75C1302.12,396.91,1300.68,353.48,1306.6,315.64Z"
                  style={{ opacity: 0.2 }}
                />
                <path
                  className="window"
                  d="M1290.71,418.45h-30.83c1.18-16.2-6-59,15.41-64.34C1296.72,359.4,1289.54,402.31,1290.71,418.45Z"
                  style={{ fill: '#e2d600' }}
                />
                <path
                  className="door-edge"
                  d="M1276.29,354.11a7.44,7.44,0,0,0-4.21.88c17.15,11.28,10.92,46.47,12,63.27l7.66.19C1290.57,402,1297.69,360.09,1276.29,354.11Z"
                  style={{ fill: '#3a393a' }}
                />
                <path
                  className="roof"
                  d="M1337.58,323.13a762.43,762.43,0,0,0-193,0c37.93-65.12,71.56-127.7,96.51-185.19C1265,196.91,1297.82,258.86,1337.58,323.13Z"
                  style={{ fill: '#090970' }}
                />
                <path
                  className="shadow-2"
                  data-name="shadow"
                  d="M1244.83,147c52.36,179.22,14.4,135.15-85.07,149.7q-7.47,13.13-15.2,26.4a762.43,762.43,0,0,1,193,0C1299.86,262.15,1268.4,203.27,1244.83,147Z"
                  style={{ opacity: 0.2 }}
                />
                <g className="briques">
                  <path
                    className="brique"
                    d="M1198.85,348c6.3-1.3,20.94-3,27-2.51"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '4px',
                    }}
                  />
                  <path
                    className="brique-2"
                    data-name="brique"
                    d="M1234.43,392.92c4.5-.16,9.19-.69,13.28,0"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '4px',
                    }}
                  />
                </g>
              </g>
            </g>
          </g>
          <g className="big-tower">
            <g className="inner-big-tower">
              <path
                className="tower"
                d="M1347.22,418.34v20.14q-22-4-43.73-6.43V411.91q-20.37-2.22-40.56-3V429q-22-.87-43.73-.06V408.84q-20.35.75-40.56,2.94v20.14q-22,2.38-43.72,6.46V418.24q-11.1,2.07-22.15,4.58v63.29l35.74,62.71c11.58,193.72,9.14,134.21,0,359.63,56.31,9.82,118.26,9.37,185.11,0-6.9-211.43-6.9-148.2,0-359.63l35.75-62.71V422.82Q1358.27,420.36,1347.22,418.34Z"
                style={{ fill: '#00246b' }}
              />
              <g
                className="shad-grp-2"
                data-name="shad-grp"
                style={{ opacity: 0.7000000000000001 }}
              >
                <path
                  className="tower-2"
                  data-name="tower"
                  d="M1347.22,418.34v20.14q-22-4-43.73-6.43V411.91q-20.37-2.22-40.56-3V429q-22-.87-43.73-.06V408.84q-20.35.75-40.56,2.94v20.14q-22,2.38-43.72,6.46V418.24q-11.1,2.07-22.15,4.58v63.29l35.74,62.71c11.58,193.72,9.14,134.21,0,359.63,56.31,9.82,118.26,9.37,185.11,0-6.9-211.43-6.9-148.2,0-359.63l35.75-62.71V422.82Q1358.27,420.36,1347.22,418.34Z"
                  style={{ fill: '#605f60' }}
                />
                <g className="briques-2" data-name="briques">
                  <path
                    className="brique-3"
                    data-name="brique"
                    d="M1180.87,617a171.22,171.22,0,0,1,29.63-2.45"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '6.76021766662598px',
                    }}
                  />
                  <path
                    className="brique-4"
                    data-name="brique"
                    d="M1190.36,698.61a164.94,164.94,0,0,1,28.48-1.73"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '6.76021766662598px',
                    }}
                  />
                  <path
                    className="brique-5"
                    data-name="brique"
                    d="M1267.17,671.57a181.63,181.63,0,0,1,31.93,2.15"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '6.76021766662598px',
                    }}
                  />
                </g>
                <path
                  className="window-2"
                  data-name="window"
                  d="M1315,641.69h-12.75V614.82c0-3.52,4.25-12.56,6.37-12.56s6.38,9,6.38,12.56Z"
                  style={{ fill: '#e2d600' }}
                />
                <path
                  className="shadow-3"
                  data-name="shadow"
                  d="M1369.37,486.11c-64.23-20.14-200.58-17.55-256.6,0l35.74,62.71q1.17,19.6,2.15,39.51c37.15-29.79,126.75-32.7,124.64,22.19-2.06,53.6-2.06,196.27-21.93,304.88a726.11,726.11,0,0,0,80.25-6.95c-6.9-211.43-6.9-148.2,0-359.63Z"
                  style={{ opacity: 0.2 }}
                />
                <path
                  className="col"
                  d="M1333.62,548.82l35.75-62.71c-64.23-20.14-200.58-17.55-256.6,0l35.74,62.71C1199.43,532.42,1285.3,532.85,1333.62,548.82Z"
                  style={{ opacity: 0.2 }}
                />
              </g>
              <path
                className="window-edge"
                d="M1308.58,602.26a1.36,1.36,0,0,0-.75.32c2.24,1.58,5.62,9.1,5.62,12.24v26.87H1315V614.82C1315,611.3,1310.71,602.26,1308.58,602.26Z"
                style={{ fill: '#494949' }}
              />
            </g>
          </g>
          <g className="big-tower-left">
            <path
              className="tower-3"
              data-name="tower"
              d="M797.88,418.59c-33.94-48.27-76.42-174-76.06-179.62C692,334.06,680.91,383.29,645,418.59a90.17,90.17,0,0,1,15.3-5.32c0,3.35,0,9.89,0,13.17l17.16,30.11c3.31,101.51,3.31,356.42,0,457.92A352.8,352.8,0,0,0,716,917.81h0a251.43,251.43,0,0,0,50.34-3.33c-4.31-109.25-5.68-358.6,0-457.92l17.16-30.11c0-3.09,0-9.61,0-12.7A132.12,132.12,0,0,1,797.88,418.59Z"
              style={{ fill: '#00246b' }}
            />
            <g
              className="shad-grp-3"
              data-name="shad-grp"
              style={{ opacity: 0.5 }}
            >
              <path
                className="back-roog"
                d="M797.88,418.59l-74.37-52.21L645,418.59C680.21,431,791.25,422.11,797.88,418.59Z"
                style={{ fill: '#040433' }}
              />
              <path
                className="tower-4"
                data-name="tower"
                d="M783.48,407v19.46l-17.16,30.11c-5.56,93-4.39,349.7,0,457.92-27,4.72-56.78,4.5-88.87,0,3.31-101.5,3.31-356.41,0-457.92l-17.16-30.11V406.16c0,.54,65.5-36.05,65.5-36.05Z"
                style={{ fill: '#605f60' }}
              />
              <g className="briques-3" data-name="briques">
                <path
                  className="brique-6"
                  data-name="brique"
                  d="M750.78,489.28a82.19,82.19,0,0,0-14.22-1.17"
                  style={{
                    fill: 'none',
                    stroke:
                      '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                    strokeWidth: '3.24548773881467px',
                  }}
                />
                <path
                  className="brique-7"
                  data-name="brique"
                  d="M746.23,528.46a80.53,80.53,0,0,0-13.68-.83"
                  style={{
                    fill: 'none',
                    stroke:
                      '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                    strokeWidth: '3.24548773881467px',
                  }}
                />
                <path
                  className="brique-8"
                  data-name="brique"
                  d="M709.35,829.13a87.57,87.57,0,0,0-15.33,1"
                  style={{
                    fill: 'none',
                    stroke:
                      '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                    strokeWidth: '3.24548773881467px',
                  }}
                />
              </g>
              <g className="windows">
                <path
                  className="window-3"
                  data-name="window"
                  d="M757.21,514.25H751.7V502.66c0-1.52,1.84-5.42,2.76-5.42s2.75,3.9,2.75,5.42Z"
                  style={{ fill: '#e2d600' }}
                />
                <path
                  className="window-edge-2"
                  data-name="window-edge"
                  d="M754.46,497.24a.63.63,0,0,0-.33.13c1,.69,2.42,3.93,2.42,5.29v11.59h.66V502.66C757.21,501.14,755.37,497.24,754.46,497.24Z"
                  style={{ fill: '#494949' }}
                />
                <path
                  className="window-4"
                  data-name="window"
                  d="M735.52,514.25h-6V501.69c0-1.65,2-5.88,3-5.88s3,4.23,3,5.88Z"
                  style={{ fill: '#e2d600' }}
                />
                <path
                  className="window-edge-3"
                  data-name="window-edge"
                  d="M732.54,495.81a.68.68,0,0,0-.36.15c1.05.74,2.63,4.26,2.63,5.73v12.56h.71V501.69C735.52,500,733.53,495.81,732.54,495.81Z"
                  style={{ fill: '#494949' }}
                />
              </g>
              <path
                className="shadow-4"
                data-name="shadow"
                d="M660.29,426.44c30.83-9.66,96.29-8.42,123.19,0l-17.16,30.11q-.55,9.42-1,19c-17.84-14.3-58.38-15.68-59.84,10.65C703.59,519.73,699,796.81,716,917.81a347.94,347.94,0,0,1-38.53-3.34c3.31-101.5,3.31-356.41,0-457.92Z"
                style={{ opacity: 0.2 }}
              />
              <path
                className="col-2"
                data-name="col"
                d="M677.45,456.55l-17.16-30.11c30.83-9.66,96.29-8.42,123.19,0l-17.16,30.11C741.88,448.68,700.65,448.89,677.45,456.55Z"
                style={{ opacity: 0.2 }}
              />
              <path
                className="drop-shadow"
                d="M783.48,419.65c-31.32-10-82.14-14.67-123.19,1.08V404.15l66.46-23.47,56.73,25.13Z"
                style={{ opacity: 0.2 }}
              />
              <path
                className="roof-2"
                data-name="roof"
                d="M721.88,238.77c-2.07.9,41.4,130.62,76,179.82-47.11-19.11-124.61-13.37-152.89,0C680.94,383.26,692,334,721.88,238.77Z"
                style={{ fill: '#090970' }}
              />
              <path
                className="shadow-5"
                data-name="shadow"
                d="M721.43,240.21C670,429.79,694.81,375.73,786.64,400.46a212.8,212.8,0,0,0,11.24,18.13c-47.11-19.11-124.61-13.37-152.89,0C680.75,383.44,691.87,334.49,721.43,240.21Z"
                style={{ opacity: 0.2 }}
              />
            </g>
          </g>
          <g className="big-tower-left-2" data-name="big-tower-left">
            <path
              className="tower-5"
              data-name="tower"
              d="M712.91,460.28c-23.36-33.23-52.6-119.79-52.36-123.64C640,402.1,632.39,436,607.67,460.28a62,62,0,0,1,10.53-3.65c0,2.3,0,6.8,0,9.06L630,486.42c2.28,69.87,2.28,355.6,0,425.48a243.08,243.08,0,0,0,26.52,2.3h0a174,174,0,0,0,34.66-2.29c-3-75.21-3.91-357.11,0-425.48L703,465.69c0-2.13,0-6.61,0-8.74A90.65,90.65,0,0,1,712.91,460.28Z"
              style={{ fill: '#00246b' }}
            />
            <g className="shad-grpe" style={{ opacity: 0.6000000000000001 }}>
              <path
                className="back-roog-2"
                data-name="back-roog"
                d="M712.91,460.28l-51.19-35.93-54.05,35.93C631.91,468.84,708.35,462.71,712.91,460.28Z"
                style={{ fill: '#040433' }}
              />
              <path
                className="tower-6"
                data-name="tower"
                d="M703,452.3v13.39l-11.81,20.73c-3.83,64-3,351,0,425.48-18.61,3.24-39.09,3.1-61.18,0,2.28-69.88,2.28-355.61,0-425.48L618.2,465.69v-14c0,.37,45.08-24.82,45.08-24.82Z"
                style={{ fill: '#605f60' }}
              />
              <g className="briques-4" data-name="briques">
                <path
                  className="brique-9"
                  data-name="brique"
                  d="M680.49,509a55.76,55.76,0,0,0-9.79-.81"
                  style={{
                    fill: 'none',
                    stroke:
                      '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                    strokeWidth: '2.23414530222429px',
                  }}
                />
                <path
                  className="brique-10"
                  data-name="brique"
                  d="M677.35,535.92a54.27,54.27,0,0,0-9.41-.57"
                  style={{
                    fill: 'none',
                    stroke:
                      '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                    strokeWidth: '2.23414530222429px',
                  }}
                />
                <path
                  className="brique-11"
                  data-name="brique"
                  d="M652,742.89a60.79,60.79,0,0,0-10.55.71"
                  style={{
                    fill: 'none',
                    stroke:
                      '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                    strokeWidth: '2.23414530222429px',
                  }}
                />
              </g>
              <path
                className="shadow-6"
                data-name="shadow"
                d="M618.2,465.69c21.22-6.65,66.28-5.8,84.8,0l-11.81,20.73q-.39,6.48-.71,13.05c-12.28-9.84-40.19-10.79-41.2,7.34-1.28,23.1-4.44,324.09,7.25,407.39A241.89,241.89,0,0,1,630,911.9c2.28-69.88,2.28-355.61,0-425.48Z"
                style={{ opacity: 0.2 }}
              />
              <path
                className="col-3"
                data-name="col"
                d="M630,486.42,618.2,465.69c21.22-6.65,66.28-5.8,84.8,0l-11.81,20.73C674.36,481,646,481.14,630,486.42Z"
                style={{ opacity: 0.2 }}
              />
              <path
                className="drop-shadow-2"
                data-name="drop-shadow"
                d="M703,461c-21.56-6.87-56.54-10.1-84.8.74V450.35L664,434.18l39,17.31Z"
                style={{ opacity: 0.2 }}
              />
              <path
                className="roof-3"
                data-name="roof"
                d="M660.6,336.5c-1.43.62,28.5,89.91,52.31,123.78-32.42-13.15-85.78-9.2-105.24,0C632.41,436,640,402.05,660.6,336.5Z"
                style={{ fill: '#090970' }}
              />
              <path
                className="shadow-7"
                data-name="shadow"
                d="M660.29,337.49C624.84,468,642,430.78,705.17,447.81c2.62,4.66,5.21,8.88,7.74,12.47-32.42-13.15-85.78-9.2-105.24,0C632.28,436.09,639.94,402.39,660.29,337.49Z"
                style={{ opacity: 0.2 }}
              />
            </g>
          </g>
          <g className="double-tower-left">
            <path
              className="back"
              d="M670.58,623.63c-2.36-3.36-4.56-6.86-6.68-10.4h0c-3.21-5.38-6.31-11.11-9.2-16.75-6.62-1.27-13.6-2.24-20.79-2.93,0-8.92,0-32.13,0-40.71l11.52-20.21V529c5.28-.6,8.8-1.2,9.67-1.66-22.82-32.5-51.26-116.71-51.06-120.58l-.27.84h0c-14.57,41-20.4,87.33-51.32,119.75a57.23,57.23,0,0,0,10.26,2.38c-1.86,1.84,10.87,21.28,11.53,23.11v41.49c-5.94.72-11.74,1.63-17.56,2.75-1,1.74-2.08,3.44-3.17,5.13h0a123.86,123.86,0,0,1-17.33,21.42,67.46,67.46,0,0,1,8.4-3.22l-8.4,3.22a76.69,76.69,0,0,0,13.44,3.11v3.8L564.72,657c2.91,89.23,2.91,143.17,0,232.4a312.42,312.42,0,0,0,33.87,2.93h0a222.11,222.11,0,0,0,44.25-2.92c-3.59-88.53-4.73-142.76-.93-215.74h0q.42-8.38.91-16.67l15.08-26.46V625.8C664.83,625,669.44,624.23,670.58,623.63Z"
              style={{ fill: '#00246b' }}
            />
            <g
              className="shad-grpe-2"
              data-name="shad-grpe"
              style={{ opacity: 0.75 }}
            >
              <g className="top-tower">
                <path
                  className="back-roog-3"
                  data-name="back-roog"
                  d="M655.1,527.35,605.17,492.3l-52.71,35.05C576.1,535.7,650.65,529.72,655.1,527.35Z"
                  style={{ fill: '#040433' }}
                />
                <path
                  className="tower-7"
                  data-name="tower"
                  d="M645.43,519.57v13.06l-11.52,20.21v67.74H574.25V552.84l-11.53-20.21V519c0,.36,44-24.2,44-24.2Z"
                  style={{ fill: '#605f60' }}
                />
                <g className="briques-5" data-name="briques">
                  <path
                    className="brique-12"
                    data-name="brique"
                    d="M623.48,574.82a55,55,0,0,0-9.55-.79"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '2.17897432007683px',
                    }}
                  />
                </g>
                <path
                  className="window-5"
                  data-name="window"
                  d="M603.43,545.93c-1.33,0-2.46,0-3.49,0l-1.23-14.29c2-.11,3.81,0,5.51,0Z"
                  style={{ fill: '#e2d600' }}
                />
                <path
                  className="shadow-8"
                  data-name="shadow"
                  d="M562.72,532.63c20.71-6.49,64.66-5.66,82.71,0l-11.52,20.21V566c-58.95-29.95-38.43,38.63-34.11,54.56H574.25V552.84Z"
                  style={{ opacity: 0.2 }}
                />
                <path
                  className="col-4"
                  data-name="col"
                  d="M574.25,552.84l-11.53-20.21c20.71-6.49,64.66-5.66,82.71,0l-11.52,20.21C617.5,547.56,589.82,547.7,574.25,552.84Z"
                  style={{ opacity: 0.2 }}
                />
                <path
                  className="drop-shadow-3"
                  data-name="drop-shadow"
                  d="M645.43,528.07c-21-6.7-55.14-9.85-82.71.72V517.66l44.63-15.76,38.08,16.88Z"
                  style={{ opacity: 0.2 }}
                />
                <path
                  className="roof-4"
                  data-name="roof"
                  d="M604.08,406.63c-1.39.6,27.79,87.69,51,120.72-31.62-12.83-83.66-9-102.64,0C576.59,503.64,584,470.56,604.08,406.63Z"
                  style={{ fill: '#090970' }}
                />
                <path
                  className="shadow-9"
                  data-name="shadow"
                  d="M603.78,407.6c-34.57,127.28-17.88,91,43.77,107.59,2.56,4.55,5.09,8.66,7.55,12.16-31.62-12.83-83.66-9-102.64,0C576.46,503.76,583.93,470.89,603.78,407.6Z"
                  style={{ opacity: 0.2 }}
                />
              </g>
              <path
                className="back-roog-4"
                data-name="back-roog"
                d="M670.58,623.63,605.2,597.21l-69,26.42C567.15,634.55,664.75,626.72,670.58,623.63Z"
                style={{ fill: '#040433' }}
              />
              <path
                className="tower-8"
                data-name="tower"
                d="M657.92,613.43v17.11L642.84,657c-4.89,81.75-3.86,137.27,0,232.4-23.77,4.14-49.91,4-78.12,0,2.91-89.23,2.91-143.17,0-232.4l-15.09-26.46V612.7C611.73,600.79,594.48,595.77,657.92,613.43Z"
                style={{ fill: '#605f60' }}
              />
              <g className="briques-6" data-name="briques">
                <path
                  className="brique-13"
                  data-name="brique"
                  d="M629.18,685.77a72.29,72.29,0,0,0-12.5-1"
                  style={{
                    fill: 'none',
                    stroke:
                      '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                    strokeWidth: '2.85284415188156px',
                  }}
                />
                <path
                  className="brique-14"
                  data-name="brique"
                  d="M625.17,720.21a70.28,70.28,0,0,0-12-.73"
                  style={{
                    fill: 'none',
                    stroke:
                      '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                    strokeWidth: '2.85284415188156px',
                  }}
                />
                <path
                  className="brique-15"
                  data-name="brique"
                  d="M592.76,814.37a77.26,77.26,0,0,0-13.47.91"
                  style={{
                    fill: 'none',
                    stroke:
                      '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                    strokeWidth: '2.85284415188156px',
                  }}
                />
              </g>
              <g className="windows-2" data-name="windows">
                <polygon
                  className="window-6"
                  data-name="window"
                  points="602.6 647.92 599.1 647.96 597.87 629.28 603.38 629.24 602.6 647.92"
                  style={{ fill: '#e2d600' }}
                />
                <polygon
                  className="window-7"
                  data-name="window"
                  points="640.4 653.09 636.74 652.42 645.25 632.41 651.46 633.66 640.4 653.09"
                  style={{ fill: '#e2d600' }}
                />
                <polygon
                  className="shadow-10"
                  data-name="shadow"
                  points="645.25 632.41 645.05 632.89 650.18 633.93 639.39 652.9 640.4 653.09 651.46 633.66 645.25 632.41"
                  style={{ opacity: 0.4 }}
                />
                <polygon
                  className="window-8"
                  data-name="window"
                  points="566.77 653.09 570.44 652.42 561.92 632.41 555.72 633.66 566.77 653.09"
                  style={{ fill: '#e2d600' }}
                />
                <polygon
                  className="shadow-11"
                  data-name="shadow"
                  points="561.92 632.41 562.13 632.89 557 633.93 567.79 652.9 566.77 653.09 555.72 633.66 561.92 632.41"
                  style={{ opacity: 0.4 }}
                />
              </g>
              <path
                className="shadow-12"
                data-name="shadow"
                d="M549.63,630.54c27.11-8.5,84.65-7.41,108.29,0L642.84,657q-.5,8.28-.91,16.67c-15.68-12.57-51.31-13.78-52.6,9.37-1.64,29.5-5.67,102.92,9.26,209.29a307.59,307.59,0,0,1-33.87-2.93c2.91-89.23,2.91-143.17,0-232.4Z"
                style={{ opacity: 0.2 }}
              />
              <path
                className="col-5"
                data-name="col"
                d="M564.72,657l-15.09-26.46c27.11-8.5,84.65-7.41,108.29,0L642.84,657C621.35,650.08,585.11,650.26,564.72,657Z"
                style={{ opacity: 0.2 }}
              />
              <path
                className="drop-shadow-4"
                data-name="drop-shadow"
                d="M657.92,624.57c-27.53-8.77-72.2-12.9-108.29.94V610.94c27-1.26,81.56-1,108.29,1.46Z"
                style={{ opacity: 0.2 }}
              />
              <g className="roof-5" data-name="roof">
                <path
                  className="roof-6"
                  data-name="roof"
                  d="M556.69,597.08a125.82,125.82,0,0,1-20.5,26.55c24.86-11.75,93-16.8,134.39,0a232.39,232.39,0,0,1-15.88-27.15C625.17,590.81,588.81,590.81,556.69,597.08Z"
                  style={{ fill: '#090970' }}
                />
                <path
                  className="light"
                  d="M660.29,607h0c-1.86-3.34-3.73-6.85-5.6-10.5-29.53-5.67-65.89-5.67-98,.6-1,1.75-2.09,3.45-3.17,5.13C574.53,593.42,646.08,591.14,660.29,607Z"
                  style={{ fill: '#1313a5' }}
                />
                <path
                  className="shadow-13"
                  data-name="shadow"
                  d="M563.72,595.83c-2.36.38-4.71.79-7,1.25a125.82,125.82,0,0,1-20.5,26.55c24.86-11.75,93-16.8,134.39,0-2.19-3.12-4.43-6.62-6.68-10.4C593.51,593.15,543.59,625.8,563.72,595.83Z"
                  style={{ opacity: 0.2 }}
                />
              </g>
            </g>
          </g>
          <g className="horizontal-top">
            <g className="double-tower-center">
              <path
                className="back-2"
                data-name="back"
                d="M967.87,430.39c-3.9-5.58-7.57-11.39-11.09-17.27h0c-5.33-8.94-10.48-18.46-15.28-27.82-11-2.11-22.59-3.72-34.53-4.88,0-14.81,0-53.36,0-67.61l19.14-33.58v-6c8.76-1,14.62-2,16-2.75-37.9-54-85.15-193.88-84.82-200.31l-.44,1.4v0c-24.2,68.17-33.88,145.07-85.25,198.93a97,97,0,0,0,17.06,3.95c-3.09,3,18,35.34,19.14,38.39v68.91c-9.86,1.2-19.5,2.72-29.17,4.57-1.7,2.89-3.46,5.71-5.26,8.52h0a204.58,204.58,0,0,1-28.79,35.58,112.38,112.38,0,0,1,14-5.34l-14,5.34A126.18,126.18,0,0,0,767,435.56v6.31l25.06,44c4.84,148.22,4.84,237.82,0,386a514.85,514.85,0,0,0,56.26,4.86h0a368.31,368.31,0,0,0,73.51-4.85c-6-147.06-7.86-237.13-1.55-358.38l0,0q.69-13.93,1.51-27.69l25.05-44V434C958.33,432.69,966,431.39,967.87,430.39Z"
                style={{ fill: '#00246b' }}
              />
              <g
                className="shad-grpe-3"
                data-name="shad-grpe"
                style={{ opacity: 0.6000000000000001 }}
              >
                <path
                  className="back-roog-5"
                  data-name="back-roog"
                  d="M942.16,270.47l-82.94-58.22-87.56,58.22C810.94,284.33,934.77,274.4,942.16,270.47Z"
                  style={{ fill: '#040433' }}
                />
                <path
                  className="tower-9"
                  data-name="tower"
                  d="M926.11,257.53v21.7L907,312.81V425.32H807.86V312.81l-19.14-33.58V256.61c0,.6,73-40.2,73-40.2Z"
                  style={{ fill: '#605f60' }}
                />
                <g className="briques-7" data-name="briques">
                  <path
                    className="brique-16"
                    data-name="brique"
                    d="M889.64,349.31A92.24,92.24,0,0,0,873.78,348"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '3.61956116072994px',
                    }}
                  />
                </g>
                <g className="window-9" data-name="window">
                  <polygon
                    className="window-10"
                    data-name="window"
                    points="904.11 308.21 900.13 307.18 911.7 281.17 917.72 282.66 904.11 308.21"
                    style={{ fill: '#e2d600' }}
                  />
                  <polygon
                    className="window-11"
                    data-name="window"
                    points="890.19 304.76 885.67 304.03 894.59 278.35 901.38 279.2 890.19 304.76"
                    style={{ fill: '#e2d600' }}
                  />
                  <polygon
                    className="window-12"
                    data-name="window"
                    points="875.54 302.68 871.14 302.61 873.36 276.44 879.93 276.9 875.54 302.68"
                    style={{ fill: '#e2d600' }}
                  />
                  <polygon
                    className="shadow-14"
                    data-name="shadow"
                    points="911.7 281.17 911.61 281.37 916.7 282.63 903.2 307.98 904.11 308.21 917.72 282.66 911.7 281.17"
                    style={{ fill: '#494949' }}
                  />
                  <polygon
                    className="shadow-15"
                    data-name="shadow"
                    points="894.59 278.35 894.3 279.16 900.02 279.88 889.2 304.6 890.19 304.76 901.38 279.2 894.59 278.35"
                    style={{ fill: '#494949' }}
                  />
                  <polygon
                    className="shadow-16"
                    data-name="shadow"
                    points="873.36 276.44 873.29 277.3 879.17 277.71 874.91 302.67 875.54 302.68 879.93 276.9 873.36 276.44"
                    style={{ fill: '#494949' }}
                  />
                  <polygon
                    className="window-13"
                    data-name="window"
                    points="810.99 308.21 814.97 307.18 803.4 281.17 797.38 282.66 810.99 308.21"
                    style={{ fill: '#e2d600' }}
                  />
                  <polygon
                    className="window-14"
                    data-name="window"
                    points="824.91 304.76 829.43 304.03 820.51 278.35 813.72 279.2 824.91 304.76"
                    style={{ fill: '#e2d600' }}
                  />
                  <polygon
                    className="window-15"
                    data-name="window"
                    points="839.56 302.68 843.96 302.61 841.74 276.44 835.17 276.9 839.56 302.68"
                    style={{ fill: '#e2d600' }}
                  />
                  <polygon
                    className="window-16"
                    data-name="window"
                    points="856.26 302.72 860.65 302.64 862.36 276.21 854.96 276.21 856.26 302.72"
                    style={{ fill: '#e2d600' }}
                  />
                  <polygon
                    className="shadow-17"
                    data-name="shadow"
                    points="803.4 281.17 803.49 281.37 798.4 282.63 811.9 307.98 810.99 308.21 797.38 282.66 803.4 281.17"
                    style={{ fill: '#494949' }}
                  />
                  <polygon
                    className="shadow-18"
                    data-name="shadow"
                    points="820.51 278.35 820.8 279.16 815.08 279.88 825.9 304.6 824.91 304.76 813.72 279.2 820.51 278.35"
                    style={{ fill: '#494949' }}
                  />
                  <polygon
                    className="shadow-19"
                    data-name="shadow"
                    points="841.74 276.44 841.81 277.3 835.93 277.71 840.19 302.67 839.56 302.68 835.17 276.9 841.74 276.44"
                    style={{ fill: '#494949' }}
                  />
                  <polygon
                    className="shadow-20"
                    data-name="shadow"
                    points="854.96 276.21 856.26 302.72 856.41 302.72 855.3 277.43 862.02 277.43 860.57 302.65 860.65 302.64 862.36 276.21 854.96 276.21"
                    style={{ fill: '#494949' }}
                  />
                </g>
                <path
                  className="shadow-21"
                  data-name="shadow"
                  d="M788.72,279.23c34.38-10.78,107.39-9.39,137.39,0L907,312.81V334.7c-97.93-49.76-63.84,64.17-56.66,90.62H807.86V312.81Z"
                  style={{ opacity: 0.2 }}
                />
                <path
                  className="col-6"
                  data-name="col"
                  d="M807.86,312.81l-19.14-33.58c34.38-10.78,107.39-9.39,137.39,0L907,312.81C879.71,304,833.73,304.26,807.86,312.81Z"
                  style={{ opacity: 0.2 }}
                />
                <path
                  className="drop-shadow-5"
                  data-name="drop-shadow"
                  d="M926.11,271.66c-34.93-11.13-91.61-16.36-137.39,1.2V254.37l74.12-26.18,63.27,28Z"
                  style={{ opacity: 0.2 }}
                />
                <path
                  className="roof-7"
                  data-name="roof"
                  d="M857.41,69.93c-2.31,1,46.17,145.67,84.75,200.54-52.53-21.31-139-14.9-170.5,0C811.74,231.08,824.06,176.13,857.41,69.93Z"
                  style={{ fill: '#090970' }}
                />
                <path
                  className="shadow-22"
                  data-name="shadow"
                  d="M856.91,71.54C799.49,283,827.22,222.67,929.63,250.26c4.24,7.56,8.44,14.39,12.53,20.21-52.53-21.31-139-14.9-170.5,0C811.54,231.28,823.94,176.68,856.91,71.54Z"
                  style={{ opacity: 0.2 }}
                />
                <path
                  className="back-roog-6"
                  data-name="back-roog"
                  d="M967.87,430.39,859.28,386.51,744.64,430.39C796.06,448.54,958.19,435.54,967.87,430.39Z"
                  style={{ fill: '#040433' }}
                />
                <path
                  className="tower-10"
                  data-name="tower"
                  d="M946.85,413.45v28.42l-25.05,44c-8.12,135.8-6.41,228,0,386-39.48,6.88-82.91,6.56-129.77,0,4.84-148.22,4.84-237.82,0-386l-25.06-44V412.24C870.13,392.45,841.47,384.12,946.85,413.45Z"
                  style={{ fill: '#605f60' }}
                />
                <g className="windows-3" data-name="windows">
                  <path
                    className="window-17"
                    data-name="window"
                    d="M912.79,556.49h-8.17V539.28c0-2.26,2.72-8,4.08-8s4.09,5.79,4.09,8Z"
                    style={{ fill: '#e2d600' }}
                  />
                  <path
                    className="window-edge-4"
                    data-name="window-edge"
                    d="M908.7,531.23a.86.86,0,0,0-.48.21c1.43,1,3.6,5.83,3.6,7.84v17.21h1V539.28C912.79,537,910.06,531.23,908.7,531.23Z"
                    style={{ fill: '#494949' }}
                  />
                  <path
                    className="window-18"
                    data-name="window"
                    d="M865,556.49h-8.17V539.28c0-2.26,2.72-8,4.08-8s4.09,5.79,4.09,8Z"
                    style={{ fill: '#e2d600' }}
                  />
                  <path
                    className="window-19"
                    data-name="window"
                    d="M809,556.49h8.17V539.28c0-2.26-2.73-8-4.09-8s-4.08,5.79-4.08,8Z"
                    style={{ fill: '#e2d600' }}
                  />
                  <path
                    className="window-edge-5"
                    data-name="window-edge"
                    d="M813,531.23a.89.89,0,0,1,.49.21c-1.44,1-3.6,5.83-3.6,7.84v17.21h-1V539.28C809,537,811.68,531.23,813,531.23Z"
                    style={{ fill: '#494949' }}
                  />
                </g>
                <g className="briques-8" data-name="briques">
                  <path
                    className="brique-17"
                    data-name="brique"
                    d="M899.11,533.62a120.28,120.28,0,0,0-20.77-1.71"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '4.73894703330049px',
                    }}
                  />
                  <path
                    className="brique-18"
                    data-name="brique"
                    d="M892.45,590.83a115.81,115.81,0,0,0-20-1.21"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '4.73894703330049px',
                    }}
                  />
                  <path
                    className="brique-19"
                    data-name="brique"
                    d="M838.61,747.24a128.31,128.31,0,0,0-22.38,1.51"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '4.73894703330049px',
                    }}
                  />
                </g>
                <path
                  className="shadow-23"
                  data-name="shadow"
                  d="M767,441.87c45-14.12,140.61-12.3,179.88,0l-25.05,44q-.82,13.74-1.51,27.69c-26-20.88-85.24-22.89-87.38,15.56-2.72,49-9.42,171,15.38,347.65A509.36,509.36,0,0,1,792,871.87c4.84-148.22,4.84-237.82,0-386Z"
                  style={{ opacity: 0.2 }}
                />
                <path
                  className="col-7"
                  data-name="col"
                  d="M792,485.83l-25.06-44c45-14.12,140.61-12.3,179.88,0l-25.05,44C886.1,474.33,825.91,474.64,792,485.83Z"
                  style={{ opacity: 0.2 }}
                />
                <path
                  className="drop-shadow-6"
                  data-name="drop-shadow"
                  d="M946.85,432c-45.72-14.56-119.93-21.42-179.88,1.57v-24.2c44.82-2.09,135.48-1.63,179.88,2.42Z"
                  style={{ opacity: 0.2 }}
                />
                <path
                  className="roof-8"
                  data-name="roof"
                  d="M778.69,386.29a208.66,208.66,0,0,1-34.05,44.1c41.29-19.51,154.46-27.9,223.23,0-8.54-12.15-17.46-27.68-26.37-45.09C892.45,375.88,832.06,375.88,778.69,386.29Z"
                  style={{ fill: '#090970' }}
                />
                <path
                  className="light-2"
                  data-name="light"
                  d="M950.79,402.72v0q-4.63-8.33-9.3-17.44c-49-9.42-109.44-9.42-162.81,1-1.7,2.91-3.47,5.73-5.26,8.52C808.33,380.21,927.18,376.42,950.79,402.72Z"
                  style={{ fill: '#1313a5' }}
                />
                <path
                  className="shadow-24"
                  data-name="shadow"
                  d="M790.38,384.21c-3.93.64-7.83,1.32-11.69,2.08a208.66,208.66,0,0,1-34.05,44.1c41.29-19.51,154.46-27.9,223.23,0-3.63-5.17-7.34-11-11.09-17.27C839.86,379.77,756.93,434,790.38,384.21Z"
                  style={{ opacity: 0.2 }}
                />
              </g>
            </g>
          </g>
          <g className="horizontal-bottom-1">
            <g className="small-tower">
              <g className="inner-small-tower">
                <path
                  className="tower-11"
                  data-name="tower"
                  d="M1092.64,515.26v12.43q-13.56-2.49-27-4V511.28q-12.57-1.36-25.05-1.86v12.43q-13.56-.52-27,0V509.38q-12.58.47-25.05,1.82v12.44q-13.57,1.47-27,4V515.19q-6.85,1.29-13.68,2.83v39.09l22.08,38.73c7.15,119.64,5.64,46.38,0,185.61,34.77,6.06,73,5.78,114.32,0-4.26-130.59-4.26-55,0-185.61l22.08-38.73V518Q1099.47,516.51,1092.64,515.26Z"
                  style={{ fill: '#00246b' }}
                />
                <g
                  className="shad-grp-4"
                  data-name="shad-grp"
                  style={{ opacity: 0.7000000000000001 }}
                >
                  <path
                    className="tower-12"
                    data-name="tower"
                    d="M1092.64,515.26v12.43q-13.56-2.49-27-4V511.28q-12.57-1.36-25.05-1.86v12.43q-13.56-.52-27,0V509.38q-12.58.47-25.05,1.82v12.44q-13.57,1.47-27,4V515.19q-6.85,1.29-13.68,2.83v39.09l22.08,38.73c7.15,119.64,5.64,46.38,0,185.61,34.77,6.06,73,5.78,114.32,0-4.26-130.59-4.26-55,0-185.61l22.08-38.73V518Q1099.47,516.51,1092.64,515.26Z"
                    style={{ fill: '#605f60' }}
                  />
                  <g className="briques-9" data-name="briques">
                    <path
                      className="brique-20"
                      data-name="brique"
                      d="M989.9,637.94a107.6,107.6,0,0,1,18.3-1.51"
                      style={{
                        fill: 'none',
                        stroke:
                          '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                        strokeWidth: '4.17516087477875px',
                      }}
                    />
                    <path
                      className="brique-21"
                      data-name="brique"
                      d="M995.77,688.35a102.46,102.46,0,0,1,17.59-1.07"
                      style={{
                        fill: 'none',
                        stroke:
                          '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                        strokeWidth: '4.17516087477875px',
                      }}
                    />
                    <path
                      className="brique-22"
                      data-name="brique"
                      d="M1043.2,671.65a112.8,112.8,0,0,1,19.72,1.33"
                      style={{
                        fill: 'none',
                        stroke:
                          '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                        strokeWidth: '4.17516087477875px',
                      }}
                    />
                  </g>
                  <path
                    className="shadow-25"
                    data-name="shadow"
                    d="M1106.32,557.11c-39.67-12.44-123.88-10.84-158.48,0l22.08,38.73q.72,12.1,1.32,24.4c23-18.4,78.29-20.2,77,13.71-1.27,33.1-1.27,84.71-13.54,151.79a453.27,453.27,0,0,0,49.56-4.29c-4.26-130.59-4.26-55,0-185.61Z"
                    style={{ opacity: 0.2 }}
                  />
                  <path
                    className="col-8"
                    data-name="col"
                    d="M1084.24,595.84l22.08-38.73c-39.67-12.44-123.88-10.84-158.48,0l22.08,38.73C1001.36,585.71,1054.4,586,1084.24,595.84Z"
                    style={{ opacity: 0.2 }}
                  />
                </g>
              </g>
            </g>
            <g className="main-castle-center">
              <path
                className="wall-2"
                data-name="wall"
                d="M1171.15,671.35c-.36,6.4-.54,6.6-.9,13-10.48-.6-15.72-.88-26.2-1.4.31-6.4.47-6.59.79-13-9.26-.46-13.89-.68-23.16-1.08-.27,6.4-.41,6.6-.69,13-10.48-.45-15.73-.66-26.21-1,.23-6.4.35-6.6.58-13-9.27-.33-13.9-.49-23.17-.77-.19,6.41-.29,6.61-.48,13-10.49-.32-15.73-.46-26.22-.7.15-6.41.22-6.61.37-13-9.27-.22-13.91-.31-23.18-.47-.1,6.41-.16,6.62-.26,13-10.49-.17-15.74-.24-26.23-.35.06-6.4.09-6.61.16-13-9.27-.09-13.91-.13-23.18-.16,0,6.41,0,6.61-.06,13-10.49,0-15.73,0-26.22,0,0-6.41,0-6.61-.06-13-9.27,0-13.91.07-23.18.16.07,6.4.1,6.61.16,13-10.49.11-15.74.18-26.23.35-.1-6.4-.16-6.61-.27-13-9.26.16-13.9.25-23.17.47.15,6.4.22,6.6.37,13-10.49.24-15.73.38-26.22.7-.19-6.41-.29-6.61-.48-13-9.27.28-13.9.44-23.17.77.23,6.41.35,6.61.58,13-10.48.38-15.73.59-26.21,1-.28-6.4-.42-6.6-.69-13-9.27.4-13.9.62-23.16,1.07.32,6.4.48,6.6.79,13-10.48.52-15.72.8-26.2,1.4-.36-6.4-.54-6.6-.9-13-9.36.53-14,.81-23.4,1.4,6.54,104,19.62,246.32,19.62,246.32h429.86s13.08-142.35,19.62-246.32C1185.19,672.16,1180.51,671.88,1171.15,671.35Z"
                style={{ fill: '#00246b' }}
              />
              <g
                className="shad-grpe-4"
                data-name="shad-grpe"
                style={{ opacity: 0.7000000000000001 }}
              >
                <path
                  className="wall-3"
                  data-name="wall"
                  d="M1171.15,671c-.36,6.4-.54,6.6-.9,13-10.48-.59-15.72-.87-26.2-1.39.31-6.4.47-6.6.79-13-9.26-.46-13.89-.67-23.16-1.07-.27,6.4-.41,6.6-.69,13-10.48-.45-15.73-.66-26.21-1,.23-6.41.35-6.61.58-13-9.27-.34-13.9-.49-23.17-.77-.19,6.41-.29,6.61-.48,13-10.49-.31-15.73-.45-26.22-.69.15-6.41.22-6.61.37-13-9.27-.21-13.91-.3-23.18-.46-.1,6.41-.16,6.61-.26,13-10.49-.18-15.74-.25-26.23-.35.06-6.41.09-6.61.16-13-9.27-.09-13.91-.12-23.18-.15,0,6.41,0,6.61-.06,13-10.49,0-15.73,0-26.22,0,0-6.41,0-6.61-.06-13-9.27,0-13.91.06-23.18.15.07,6.41.1,6.61.16,13-10.49.1-15.74.17-26.23.35-.1-6.41-.16-6.61-.27-13-9.26.16-13.9.25-23.17.46.15,6.41.22,6.61.37,13-10.49.24-15.73.38-26.22.69-.19-6.4-.29-6.6-.48-13-9.27.28-13.9.43-23.17.77.23,6.4.35,6.6.58,13-10.48.38-15.73.59-26.21,1-.28-6.4-.42-6.6-.69-13-9.27.4-13.9.61-23.16,1.07.32,6.4.48,6.6.79,13-10.48.52-15.72.8-26.2,1.39-.36-6.4-.54-6.59-.9-13-9.36.53-14,.81-23.4,1.4,6.54,104,19.62,246.32,19.62,246.32h429.86s13.08-142.35,19.62-246.32C1185.19,671.78,1180.51,671.5,1171.15,671Z"
                  style={{ fill: '#605f60' }}
                />
                <g className="briques-10" data-name="briques">
                  <path
                    className="brique-23"
                    data-name="brique"
                    d="M792.49,754.92a164.44,164.44,0,0,1,30.64-1.44"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '4px',
                    }}
                  />
                  <path
                    className="brique-24"
                    data-name="brique"
                    d="M1109.66,746.5a117,117,0,0,1,15.55.68"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '4px',
                    }}
                  />
                  <path
                    className="brique-25"
                    data-name="brique"
                    d="M1041.91,806.25c8.49-.3,16.41-.07,19.18,0"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '4px',
                    }}
                  />
                  <path
                    className="brique-26"
                    data-name="brique"
                    d="M848,714.75a163.88,163.88,0,0,1,20.08-1.36"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '4px',
                    }}
                  />
                </g>
                <path
                  className="shadow-26"
                  data-name="shadow"
                  d="M1171.15,671.35c-.36,6.4-.54,6.6-.9,13-10.48-.6-15.72-.88-26.2-1.4.31-6.4.47-6.59.79-13-9.26-.46-13.89-.68-23.16-1.08-.27,6.4-.41,6.6-.69,13-10.48-.45-15.73-.66-26.21-1,.23-6.4.35-6.6.58-13-9.27-.33-13.9-.49-23.17-.77-.19,6.41-.29,6.61-.48,13-10.49-.32-15.73-.46-26.22-.7.15-6.41.22-6.61.37-13-9.27-.22-13.91-.31-23.18-.47-.1,6.41-.16,6.62-.26,13-10.49-.17-15.74-.24-26.23-.35.06-6.4.09-6.61.16-13-9.27-.09-13.91-.13-23.18-.16,0,6.41,0,6.61-.06,13-10.49,0-15.73,0-26.22,0,0-6.41,0-6.61-.06-13-9.27,0-13.91.07-23.18.16.07,6.4.1,6.61.16,13-10.49.11-15.74.18-26.23.35-.1-6.4-.16-6.61-.27-13-9.26.16-13.9.25-23.17.47.15,6.4.22,6.6.37,13-10.49.24-15.73.38-26.22.7-.19-6.41-.29-6.61-.48-13-9.27.28-13.9.44-23.17.77.23,6.41.35,6.61.58,13-10.48.38-15.73.59-26.21,1-.28-6.4-.42-6.6-.69-13-9.27.4-13.9.62-23.16,1.07.32,6.4.48,6.6.79,13-10.48.52-15.72.8-26.2,1.4-.36-6.4-.54-6.6-.9-13-9.36.53-14,.81-23.4,1.4,6.54,104,19.62,246.32,19.62,246.32H778c-8-90.92,3.62-181.28,70.44-197.55,49.23-12,168.07-10.38,226-.16,81.16,14.31,75,119,67.31,197.71h33.19s13.08-142.35,19.62-246.32C1185.19,672.16,1180.51,671.88,1171.15,671.35Z"
                  style={{ opacity: 0.2 }}
                />
              </g>
            </g>
          </g>
          <g className="horizontal-bottom-general">
            <g className="ground2" style={{ opacity: 0.6000000000000001 }}>
              <path
                className="right"
                d="M1825.19,815.34V727.62l12.07-21.17V685.09q-3.75-.83-7.48-1.51v6.8c-7.25-2.51-17,1.67-14.76-9-7.3.27-15.73-5.15-13.68,5.78-7.52-1.61-16.89,4.4-14.76-6.82-28.46-.21,1.57,7.82-28.45,10v-6.79c-2.5.46-5,1-7.48,1.54v21.36l12.07,21.17v87.72c-165,8.9-369.08,90.15-411.51,350.09h585.41V835.11C1908.58,825.26,1869.73,817.77,1825.19,815.34Z"
                style={{ fill: '#12436b' }}
              />
              <path
                className="left"
                d="M194.93,786.76c4.43-13.48-12.31-152.78,14-150.21h0c-15.07-21.43-34-77.28-33.81-79.84-.06.19-.12.38-.17.56h0c-9.65,27.18-13.5,57.82-34,79.29h0c1.84.65,6.8,1.58,6.8,1.58l7.63,15.3V785.22q-11.1,0-21.79.49c3.74-11.74-10.41-126.19,11.9-124.6-12.78-18.18-28.81-65.59-28.69-67.75l-.14.47h0c-8.19,23.07-11.46,49.07-28.84,67.3,22.89-2,8.44,116,12.25,127.17C40,795-4.83,811.18-17.13,823v330.32h585.4C517.28,879.38,341.32,798.38,194.93,786.76Z"
                style={{ fill: '#12436b' }}
              />
            </g>
            <g className="light-radius" style={{ opacity: 0.5 }}>
              <path
                className="inner-light"
                d="M1168.51,874.83h-417c0-115.16,93.35-208.51,208.51-208.51S1168.51,759.67,1168.51,874.83Z"
                style={{ fill: '#d9f700', opacity: 0.1 }}
              />
              <path
                className="inner-light-2"
                data-name="inner-light"
                d="M1282.74,916.23C1274.45,745.16,1133.13,609,960,609S645.55,745.16,637.26,916.23Z"
                style={{ fill: '#d9f700', opacity: 0.1 }}
              />
              <path
                className="inner-light-3"
                data-name="inner-light"
                d="M1401.6,912.15c-39-208.44-221.85-366.21-441.6-366.21S557.36,703.71,518.4,912.15Z"
                style={{ fill: '#d9f700', opacity: 0.1 }}
              />
            </g>
            <g className="wall-left">
              <path
                className="wall-4"
                data-name="wall"
                d="M890.37,809.12c-.21,4.89-.31,7.34-.51,12.24-10.92-.45-16.38-.66-27.3-1l.42-12.24c-9.76-.34-14.64-.49-24.4-.77l-.35,12.24c-10.92-.31-16.39-.45-27.31-.68.1-4.9.16-7.35.26-12.25-9.76-.21-14.64-.3-24.4-.46-.07,4.9-.11,7.35-.19,12.25-10.93-.18-16.39-.25-27.32-.35,0-4.9.07-7.34.11-12.24-9.76-.09-14.64-.12-24.4-.16,0,4.9,0,7.35,0,12.25-10.93,0-16.4,0-27.32,0l0-12.25c-9.76,0-14.64.07-24.4.16.05,4.9.07,7.34.12,12.24-10.93.1-16.4.17-27.33.35-.07-4.9-.11-7.35-.19-12.25-9.76.16-14.64.25-24.4.46.11,4.9.16,7.35.27,12.25-10.93.23-16.39.37-27.32.68L604,807.32c-9.76.28-14.64.43-24.39.77l.42,12.24c-10.93.37-16.39.58-27.31,1l-.5-12.24c-10.07.41-15.1.63-25.17,1.11l5.61,118.91c125.74-.6,251.55.5,377.29,0l5.61-118.91C905.47,809.75,900.43,809.53,890.37,809.12Z"
                style={{ fill: '#00246b' }}
              />
              <g
                className="shad-grpe-5"
                data-name="shad-grpe"
                style={{ opacity: 0.8 }}
              >
                <path
                  className="wall-5"
                  data-name="wall"
                  d="M890.37,809.12c-.21,4.89-.31,7.34-.51,12.24-10.92-.45-16.38-.66-27.3-1l.42-12.24c-9.76-.34-14.64-.49-24.4-.77l-.35,12.24c-10.92-.31-16.39-.45-27.31-.68.1-4.9.16-7.35.26-12.25-9.76-.21-14.64-.3-24.4-.46-.07,4.9-.11,7.35-.19,12.25-10.93-.18-16.39-.25-27.32-.35,0-4.9.07-7.34.11-12.24-9.76-.09-14.64-.12-24.4-.16,0,4.9,0,7.35,0,12.25-10.93,0-16.4,0-27.32,0l0-12.25c-9.76,0-14.64.07-24.4.16.05,4.9.07,7.34.12,12.24-10.93.1-16.4.17-27.33.35-.07-4.9-.11-7.35-.19-12.25-9.76.16-14.64.25-24.4.46.11,4.9.16,7.35.27,12.25-10.93.23-16.39.37-27.32.68L604,807.32c-9.76.28-14.64.43-24.39.77l.42,12.24c-10.93.37-16.39.58-27.31,1l-.5-12.24c-10.07.41-15.1.63-25.17,1.11l5.61,118.91c125.74-.6,251.55.5,377.29,0l5.61-118.91C905.47,809.75,900.43,809.53,890.37,809.12Z"
                  style={{ fill: '#605f60' }}
                />
                <g className="briques-11" data-name="briques">
                  <line
                    className="brique-27"
                    data-name="brique"
                    x1="554.19"
                    y1="836.39"
                    x2="567.46"
                    y2="836.2"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '1.98825633525848px',
                    }}
                  />
                  <line
                    className="brique-28"
                    data-name="brique"
                    x1="647.13"
                    y1="891.73"
                    x2="659.38"
                    y2="891.73"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '1.98825633525848px',
                    }}
                  />
                  <line
                    className="brique-29"
                    data-name="brique"
                    x1="781.7"
                    y1="836.05"
                    x2="796.34"
                    y2="836.39"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '1.98825633525848px',
                    }}
                  />
                  <line
                    className="brique-30"
                    data-name="brique"
                    x1="827.21"
                    y1="869.2"
                    x2="839.47"
                    y2="869.62"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '1.98825633525848px',
                    }}
                  />
                  <line
                    className="brique-31"
                    data-name="brique"
                    x1="868.06"
                    y1="850.69"
                    x2="881.34"
                    y2="851.03"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '1.98825633525848px',
                    }}
                  />
                </g>
                <path
                  className="shadow-27"
                  data-name="shadow"
                  d="M890.37,809.12c-.21,4.89-.31,7.34-.51,12.24-4.26-.18-12.93-.51-16.18-.64,9.53,86.48,5.78,89.42-19.23,92.93-18.88,2.65-239.65-1.63-263.83-1.54-30.78.11-32,10.17-32.52-91l-5.41.22-.5-12.24c-10.07.41-15.1.63-25.17,1.11l5.61,118.91c125.74-.6,251.55.5,377.29,0l5.61-118.91C905.47,809.75,900.43,809.53,890.37,809.12Z"
                  style={{ opacity: 0.2 }}
                />
              </g>
            </g>
            <g className="wall-right">
              <path
                className="wall-6"
                data-name="wall"
                d="M1029.36,813.47l.5,12.23c10.93-.45,16.39-.65,27.31-1l-.42-12.24c9.76-.33,14.64-.49,24.4-.76.14,4.89.21,7.34.34,12.24,10.93-.31,16.39-.45,27.32-.69-.11-4.9-.16-7.34-.27-12.24,9.76-.22,14.64-.31,24.4-.46l.2,12.24c10.93-.17,16.39-.24,27.32-.34,0-4.9-.07-7.35-.11-12.25,9.76-.09,14.64-.12,24.4-.15,0,4.9,0,7.35,0,12.25,10.93,0,16.39,0,27.32,0,0-4.9,0-7.35,0-12.25,9.76,0,14.65.06,24.41.15,0,4.9-.07,7.35-.12,12.25,10.93.1,16.4.17,27.32.34l.2-12.24c9.76.15,14.64.24,24.4.46-.11,4.9-.16,7.34-.27,12.24,10.93.24,16.39.38,27.32.69l.35-12.24c9.75.27,14.63.43,24.39.76l-.42,12.24c10.92.38,16.39.58,27.31,1l.5-12.24c10.07.42,15.1.64,25.17,1.11l-5.61,118.92c-125.74-.61-251.56.5-377.3,0Q1007,874,1004.2,814.57C1014.26,814.1,1019.3,813.88,1029.36,813.47Z"
                style={{ fill: '#00246b' }}
              />
              <g
                className="shad-grpe-6"
                data-name="shad-grpe"
                style={{ opacity: 0.85 }}
              >
                <path
                  className="wall-7"
                  data-name="wall"
                  d="M1029.36,813.47l.5,12.23c10.93-.45,16.39-.65,27.31-1l-.42-12.24c9.76-.33,14.64-.49,24.4-.76.14,4.89.21,7.34.34,12.24,10.93-.31,16.39-.45,27.32-.69-.11-4.9-.16-7.34-.27-12.24,9.76-.22,14.64-.31,24.4-.46l.2,12.24c10.93-.17,16.39-.24,27.32-.34,0-4.9-.07-7.35-.11-12.25,9.76-.09,14.64-.12,24.4-.15,0,4.9,0,7.35,0,12.25,10.93,0,16.39,0,27.32,0,0-4.9,0-7.35,0-12.25,9.76,0,14.65.06,24.41.15,0,4.9-.07,7.35-.12,12.25,10.93.1,16.4.17,27.32.34l.2-12.24c9.76.15,14.64.24,24.4.46-.11,4.9-.16,7.34-.27,12.24,10.93.24,16.39.38,27.32.69l.35-12.24c9.75.27,14.63.43,24.39.76l-.42,12.24c10.92.38,16.39.58,27.31,1l.5-12.24c10.07.42,15.1.64,25.17,1.11l-5.61,118.92c-125.74-.61-251.56.5-377.3,0Q1007,874,1004.2,814.57C1014.26,814.1,1019.3,813.88,1029.36,813.47Z"
                  style={{ fill: '#605f60' }}
                />
                <g className="briques-12" data-name="briques">
                  <line
                    className="brique-32"
                    data-name="brique"
                    x1="1365.54"
                    y1="840.74"
                    x2="1352.27"
                    y2="840.55"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '1.98825633525848px',
                    }}
                  />
                  <line
                    className="brique-33"
                    data-name="brique"
                    x1="1272.6"
                    y1="896.08"
                    x2="1260.35"
                    y2="896.08"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '1.98825633525848px',
                    }}
                  />
                  <line
                    className="brique-34"
                    data-name="brique"
                    x1="1138.03"
                    y1="840.4"
                    x2="1123.38"
                    y2="840.74"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '1.98825633525848px',
                    }}
                  />
                  <line
                    className="brique-35"
                    data-name="brique"
                    x1="1092.52"
                    y1="873.54"
                    x2="1080.26"
                    y2="873.96"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '1.98825633525848px',
                    }}
                  />
                  <line
                    className="brique-36"
                    data-name="brique"
                    x1="1051.66"
                    y1="855.03"
                    x2="1038.39"
                    y2="855.37"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '1.98825633525848px',
                    }}
                  />
                </g>
                <path
                  className="shadow-28"
                  data-name="shadow"
                  d="M1029.36,813.47l.5,12.23,16.19-.63c-9.53,86.47-5.79,89.41,19.23,92.92,18.88,2.65,239.64-1.62,263.83-1.54,30.78.11,32,10.17,32.52-91l5.41.22.5-12.24c10.07.42,15.1.64,25.17,1.11l-5.61,118.92c-125.74-.61-251.56.5-377.3,0Q1007,874,1004.2,814.57C1014.26,814.1,1019.3,813.88,1029.36,813.47Z"
                  style={{ opacity: 0.2 }}
                />
              </g>
            </g>
            <g className="tower-roof-left">
              <path
                className="back-3"
                data-name="back"
                d="M545,673.86s-.22,2.24-.37,3.73c-4-.4-6.07-.58-10.12-.86.1-1.5.15-2.25.26-3.74-4-.28-5.93-.39-9.89-.56-.07,1.5-.1,2.25-.16,3.75-4.06-.18-6.09-.24-10.15-.29l0-3.75c-4-.06-5.94-.06-9.91,0,0,1.5,0,2.25.06,3.75-4.06.05-6.09.11-10.15.29-.07-1.5-.1-2.25-.16-3.75-4,.17-5.94.28-9.89.56.1,1.49.15,2.24.26,3.74-4.05.28-6.08.46-10.12.86-.15-1.49-.23-2.24-.38-3.73a16.42,16.42,0,0,0-2.38.38s-.28,12.33,0,12.13c-1.79,1.37,10,19.63,10.52,21.09,2,62.18,2,146.78,0,209a219.93,219.93,0,0,0,23.6,2.05h0a154.26,154.26,0,0,0,30.84-2c-2.63-67-3.49-148.06,0-209L547.4,689V674.26Z"
                style={{ fill: '#00246b' }}
              />
              <path
                className="top-back"
                d="M556.22,684.08c-20.76-29.54-46.79-106.51-46.59-110l-.24.77h0c-13.3,37.46-18.61,79.68-46.83,109.27h0a53,53,0,0,0,9.37,2.17c-.26.2,0-12.13,0-12.13a16.42,16.42,0,0,1,2.38-.38c.15,1.49.23,2.24.38,3.73,4-.4,6.07-.57,10.12-.86-.11-1.49-.16-2.24-.26-3.74,3.95-.28,5.93-.39,9.89-.56.06,1.5.09,2.25.16,3.75,4.06-.17,6.09-.23,10.15-.29,0-1.5,0-2.25-.06-3.75,4,0,6,0,9.91,0l0,3.75c4.06.06,6.09.12,10.15.29.06-1.5.09-2.25.16-3.75,4,.17,5.93.28,9.89.56-.11,1.5-.16,2.25-.26,3.74,4,.29,6.07.46,10.12.86.15-1.49.37-3.73.37-3.73l2.4.4v11.45c4.82-.54,8-1.09,8.82-1.51Z"
                style={{ fill: '#00246b' }}
              />
              <g
                className="shad-grpe-7"
                data-name="shad-grpe"
                style={{ opacity: 0.85 }}
              >
                <path
                  className="tower-13"
                  data-name="tower"
                  d="M545,673.86s-.22,2.24-.37,3.73c-4-.4-6.07-.58-10.12-.86.1-1.5.15-2.25.26-3.74-4-.28-5.93-.39-9.89-.56-.07,1.5-.1,2.25-.16,3.75-4.06-.18-6.09-.24-10.15-.29l0-3.75c-4-.06-5.94-.06-9.91,0,0,1.5,0,2.25.06,3.75-4.06.05-6.09.11-10.15.29-.07-1.5-.1-2.25-.16-3.75-4,.17-5.94.28-9.89.56.1,1.49.15,2.24.26,3.74-4.05.28-6.08.46-10.12.86-.15-1.49-.23-2.24-.38-3.73a16.42,16.42,0,0,0-2.38.38l0,14.77,10.52,18.45c2,62.18,2,146.78,0,209,19.66,2.76,37.88,2.89,54.44,0-2.69-66.29-3.41-152,0-209L547.4,689V674.26Z"
                  style={{ fill: '#605f60' }}
                />
                <g className="top-shadow" style={{ opacity: 0.2 }}>
                  <path d="M544.63,677.59c-4-.4-6.07-.58-10.12-.86.1-1.5.15-2.25.26-3.74-4-.28-5.93-.39-9.89-.56-.07,1.5-.1,2.25-.16,3.75-4.06-.18-6.09-.24-10.15-.29l0-3.75c-4-.06-5.94-.06-9.91,0,0,1.5,0,2.25.06,3.75-4.06.05-6.09.11-10.15.29-.07-1.5-.1-2.25-.16-3.75-4,.17-5.94.28-9.89.56.1,1.49.15,2.24.26,3.74-4.05.28-6.08.46-10.12.86-.15-1.49-.23-2.24-.38-3.73a16.42,16.42,0,0,0-2.38.38v8.47c21.66-3.81,45.32-6.53,75.46.54v-9l-2.4-.4S544.78,676.1,544.63,677.59Z" />
                </g>
                <g className="briques-13" data-name="briques">
                  <path
                    className="brique-37"
                    data-name="brique"
                    d="M527.37,727.51a49.23,49.23,0,0,0-8.71-.72"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '1.98825633525848px',
                    }}
                  />
                  <path
                    className="brique-38"
                    data-name="brique"
                    d="M524.58,751.51a48.45,48.45,0,0,0-8.38-.51"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '1.98825633525848px',
                    }}
                  />
                  <path
                    className="brique-39"
                    data-name="brique"
                    d="M502,864.14a53.5,53.5,0,0,0-9.39.63"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '1.98825633525848px',
                    }}
                  />
                </g>
                <path
                  className="shadow-29"
                  data-name="shadow"
                  d="M471.93,689c18.89-5.92,59-5.16,75.47,0l-10.51,18.45q-.35,5.76-.63,11.62c-10.93-8.77-35.76-9.61-36.66,6.52-1.14,20.56-4,118.74,6.45,192.87a214.29,214.29,0,0,1-23.6-2.05c2-62.18,2-146.78,0-209Z"
                  style={{ opacity: 0.2 }}
                />
                <path
                  className="col-9"
                  data-name="col"
                  d="M482.45,707.46,471.93,689c18.89-5.92,59-5.16,75.47,0l-10.51,18.45C521.91,702.63,496.66,702.76,482.45,707.46Z"
                  style={{ opacity: 0.2 }}
                />
                <g className="roof-tower-side">
                  <path
                    className="roof-10"
                    data-name="roof"
                    d="M509.67,573.92c-1.27.55,25.36,80,46.55,110.16-28.85-11.71-76.33-8.18-93.66,0C484.58,662.44,491.35,632.26,509.67,573.92Z"
                    style={{ fill: '#090970' }}
                  />
                  <path
                    className="shadow-30"
                    data-name="shadow"
                    d="M509.39,574.81c-31.54,116.14-16.31,83,40,98.17,2.33,4.15,4.63,7.9,6.88,11.1-28.85-11.71-76.33-8.18-93.66,0C484.47,662.55,491.28,632.56,509.39,574.81Z"
                    style={{ opacity: 0.2 }}
                  />
                </g>
              </g>
            </g>
            <g className="tower-roof-right">
              <path
                className="back-4"
                data-name="back"
                d="M1373.67,673.86s.22,2.24.37,3.73c4-.4,6.07-.58,10.12-.86-.1-1.5-.16-2.25-.26-3.74,3.95-.28,5.93-.39,9.89-.56.07,1.5.1,2.25.16,3.75,4.06-.18,6.09-.24,10.15-.29l0-3.75c4-.06,5.94-.06,9.9,0l0,3.75c4.06.05,6.09.11,10.15.29.06-1.5.1-2.25.16-3.75,4,.17,5.94.28,9.89.56-.1,1.49-.16,2.24-.26,3.74,4.05.28,6.08.46,10.12.86.15-1.49.23-2.24.37-3.73a16.43,16.43,0,0,1,2.39.38s.27,12.33,0,12.13c1.79,1.37-10,19.63-10.52,21.09-2,62.18-2,146.78,0,209a219.93,219.93,0,0,1-23.6,2.05h0a154.26,154.26,0,0,1-30.84-2c2.63-67,3.49-148.06,0-209L1371.27,689V674.26Z"
                style={{ fill: '#00246b' }}
              />
              <path
                className="top-back"
                d="M1362.45,684.08c20.76-29.54,46.79-106.51,46.59-110l.24.77h0c13.3,37.46,18.61,79.68,46.83,109.27h0a53,53,0,0,1-9.37,2.17c.25.2,0-12.13,0-12.13a16.43,16.43,0,0,0-2.39-.38c-.14,1.49-.22,2.24-.37,3.73-4-.4-6.07-.57-10.12-.86.1-1.49.16-2.24.26-3.74-3.95-.28-5.93-.39-9.89-.56-.06,1.5-.1,2.25-.16,3.75-4.06-.17-6.09-.23-10.15-.29l0-3.75c-4,0-5.94,0-9.9,0l0,3.75c-4.06.06-6.09.12-10.15.29-.06-1.5-.09-2.25-.16-3.75-4,.17-5.94.28-9.89.56.1,1.5.16,2.25.26,3.74-4.05.29-6.08.46-10.12.86-.15-1.49-.37-3.73-.37-3.73l-2.4.4v11.45c-4.82-.54-8-1.09-8.82-1.51Z"
                style={{ fill: '#00246b' }}
              />
              <g className="shade-grpe">
                <path
                  className="tower-14"
                  data-name="tower"
                  d="M1373.67,673.86s.22,2.24.37,3.73c4-.4,6.07-.58,10.12-.86-.1-1.5-.16-2.25-.26-3.74,3.95-.28,5.93-.39,9.89-.56.07,1.5.1,2.25.16,3.75,4.06-.18,6.09-.24,10.15-.29l0-3.75c4-.06,5.94-.06,9.9,0l0,3.75c4.06.05,6.09.11,10.15.29.06-1.5.1-2.25.16-3.75,4,.17,5.94.28,9.89.56-.1,1.49-.16,2.24-.26,3.74,4.05.28,6.08.46,10.12.86.15-1.49.23-2.24.37-3.73a16.43,16.43,0,0,1,2.39.38l0,14.77-10.52,18.45c-2,62.18-2,146.78,0,209-19.66,2.76-37.88,2.89-54.44,0,2.69-66.29,3.4-152,0-209L1371.27,689V674.26Z"
                  style={{ fill: '#605f60' }}
                />
                <g
                  className="top-shadow-2"
                  data-name="top-shadow"
                  style={{ opacity: 0.2 }}
                >
                  <path d="M1374,677.59c4-.4,6.07-.58,10.12-.86-.1-1.5-.16-2.25-.26-3.74,3.95-.28,5.93-.39,9.89-.56.07,1.5.1,2.25.16,3.75,4.06-.18,6.09-.24,10.15-.29l0-3.75c4-.06,5.94-.06,9.9,0l0,3.75c4.06.05,6.09.11,10.15.29.06-1.5.1-2.25.16-3.75,4,.17,5.94.28,9.89.56-.1,1.49-.16,2.24-.26,3.74,4.05.28,6.08.46,10.12.86.15-1.49.23-2.24.37-3.73a16.43,16.43,0,0,1,2.39.38v8.47c-21.66-3.81-45.32-6.53-75.46.54v-9l2.4-.4S1373.89,676.1,1374,677.59Z" />
                </g>
                <g className="briques-14" data-name="briques">
                  <path
                    className="brique-40"
                    data-name="brique"
                    d="M1391.3,727.51a49.23,49.23,0,0,1,8.71-.72"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '1.98825633525848px',
                    }}
                  />
                  <path
                    className="brique-41"
                    data-name="brique"
                    d="M1394.09,751.51a48.45,48.45,0,0,1,8.38-.51"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '1.98825633525848px',
                    }}
                  />
                  <path
                    className="brique-42"
                    data-name="brique"
                    d="M1416.68,864.14a53.56,53.56,0,0,1,9.39.63"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '1.98825633525848px',
                    }}
                  />
                </g>
                <path
                  className="shadow-31"
                  data-name="shadow"
                  d="M1446.74,689c-18.89-5.92-59-5.16-75.47,0l10.51,18.45q.35,5.76.63,11.62c10.93-8.77,35.76-9.61,36.66,6.52,1.14,20.56,4,118.74-6.45,192.87a214.5,214.5,0,0,0,23.6-2.05c-2-62.18-2-146.78,0-209Z"
                  style={{ opacity: 0.2 }}
                />
                <path
                  className="col-10"
                  data-name="col"
                  d="M1436.22,707.46,1446.74,689c-18.89-5.92-59-5.16-75.47,0l10.51,18.45C1396.75,702.63,1422,702.76,1436.22,707.46Z"
                  style={{ opacity: 0.2 }}
                />
                <g className="roof-tower-side">
                  <path
                    className="roof-12"
                    data-name="roof"
                    d="M1409,573.92c1.27.55-25.36,80-46.55,110.16,28.85-11.71,76.33-8.18,93.66,0C1434.09,662.44,1427.32,632.26,1409,573.92Z"
                    style={{ fill: '#090970' }}
                  />
                  <path
                    className="shadow-32"
                    data-name="shadow"
                    d="M1409.28,574.81c31.54,116.14,16.31,83-40,98.17-2.33,4.15-4.64,7.9-6.88,11.1,28.85-11.71,76.33-8.18,93.66,0C1434.2,662.55,1427.39,632.56,1409.28,574.81Z"
                    style={{ opacity: 0.2 }}
                  />
                </g>
              </g>
            </g>
            <g className="tower-right">
              <path
                className="tower-15"
                data-name="tower"
                d="M1269.53,612.63v11.91q-13-2.38-25.87-3.8V608.82q-12-1.32-24-1.79V619q-13-.51-25.87,0V607q-12,.45-24,1.75v11.91q-13,1.41-25.87,3.82V612.57q-6.57,1.23-13.11,2.71v37.44L1152,689.83c6.85,114.63,5.41,152.61,0,286,33.32,5.81,70,5.54,109.53,0-4.08-125.1-4.08-160.88,0-286l21.15-37.11V615.28Q1276.07,613.82,1269.53,612.63Z"
                style={{ fill: '#00246b' }}
              />
              <g
                className="shad-grpe-8"
                data-name="shad-grpe"
                style={{ opacity: 0.85 }}
              >
                <path
                  className="tower-16"
                  data-name="tower"
                  d="M1269.53,612.63v11.91q-13-2.38-25.87-3.8V608.82q-12-1.32-24-1.79V619q-13-.51-25.87,0V607q-12,.45-24,1.75v11.91q-13,1.41-25.87,3.82V612.57q-6.57,1.23-13.11,2.71v37.44L1152,689.83c6.85,114.63,5.41,152.61,0,286,33.32,5.81,70,5.54,109.53,0-4.08-125.1-4.08-160.88,0-286l21.15-37.11V615.28Q1276.07,613.82,1269.53,612.63Z"
                  style={{ fill: '#605f60' }}
                />
                <g className="briques-15" data-name="briques">
                  <path
                    className="brique-43"
                    data-name="brique"
                    d="M1171.11,730.17a102.65,102.65,0,0,1,17.53-1.45"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '4px',
                    }}
                  />
                  <path
                    className="brique-44"
                    data-name="brique"
                    d="M1176.73,778.46a98,98,0,0,1,16.85-1"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '4px',
                    }}
                  />
                  <path
                    className="brique-45"
                    data-name="brique"
                    d="M1222.17,870.63a107.45,107.45,0,0,1,18.9,1.28"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '4px',
                    }}
                  />
                </g>
                <g className="tower-windows">
                  <path
                    className="window-20"
                    d="M1173.55,758.5h11.6V734.06c0-3.21-3.87-11.43-5.8-11.43s-5.8,8.22-5.8,11.43Z"
                    style={{ fill: '#e2d600' }}
                  />
                  <path
                    className="window-edge-6"
                    data-name="window-edge"
                    d="M1179.35,722.63a1.26,1.26,0,0,1,.69.29c-2,1.44-5.11,8.28-5.11,11.14V758.5h-1.38V734.06C1173.55,730.85,1177.42,722.63,1179.35,722.63Z"
                    style={{ fill: '#494949' }}
                  />
                  <path
                    className="window-21"
                    data-name="window"
                    d="M1246.87,758.19h-11.61V733.75c0-3.2,3.87-11.43,5.81-11.43s5.8,8.23,5.8,11.43Z"
                    style={{ fill: '#e2d600' }}
                  />
                  <path
                    className="window-edge-7"
                    data-name="window-edge"
                    d="M1241.07,722.32a1.3,1.3,0,0,0-.69.29c2,1.45,5.11,8.28,5.11,11.14v24.44h1.38V733.75C1246.87,730.55,1243,722.32,1241.07,722.32Z"
                    style={{ fill: '#494949' }}
                  />
                </g>
                <path
                  className="shadow-33"
                  data-name="shadow"
                  d="M1282.64,652.72c-38-11.91-118.68-10.38-151.83,0L1152,689.83q.69,11.59,1.27,23.38c22-17.63,72-19.33,73.75,13.13,2.3,41.36,8,104.46-13,253.59a429.07,429.07,0,0,0,47.49-4.11c-4.08-125.1-4.08-160.88,0-286Z"
                  style={{ opacity: 0.2 }}
                />
                <path
                  className="col-11"
                  data-name="col"
                  d="M1261.49,689.83l21.15-37.11c-38-11.91-118.68-10.38-151.83,0L1152,689.83C1182.09,680.13,1232.9,680.38,1261.49,689.83Z"
                  style={{ opacity: 0.2 }}
                />
              </g>
            </g>
            <g className="tower-left">
              <path
                className="tower-17"
                data-name="tower"
                d="M658.38,612.63v11.91q13-2.38,25.88-3.8V608.82q12-1.32,24-1.79V619q13-.51,25.87,0V607q12,.45,24,1.75v11.91q13,1.41,25.87,3.82V612.57q6.57,1.23,13.11,2.71v37.44L776,689.83c-6.85,114.63-5.41,152.61,0,286-33.32,5.81-70,5.54-109.53,0,4.08-125.1,4.08-160.88,0-286l-21.15-37.11V615.28Q651.85,613.82,658.38,612.63Z"
                style={{ fill: '#00246b' }}
              />
              <g
                className="shad-grpe-9"
                data-name="shad-grpe"
                style={{ opacity: 0.85 }}
              >
                <path
                  className="tower-18"
                  data-name="tower"
                  d="M658.38,612.63v11.91q13-2.38,25.88-3.8V608.82q12-1.32,24-1.79V619q13-.51,25.87,0V607q12,.45,24,1.75v11.91q13,1.41,25.87,3.82V612.57q6.57,1.23,13.11,2.71v37.44L776,689.83c-6.85,114.63-5.41,152.61,0,286-33.32,5.81-70,5.54-109.53,0,4.08-125.1,4.08-160.88,0-286l-21.15-37.11V615.28Q651.85,613.82,658.38,612.63Z"
                  style={{ fill: '#605f60' }}
                />
                <g className="briques-16" data-name="briques">
                  <path
                    className="brique-46"
                    data-name="brique"
                    d="M768.38,708a102.65,102.65,0,0,0-17.53-1.45"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '4px',
                    }}
                  />
                  <path
                    className="brique-47"
                    data-name="brique"
                    d="M751.19,778.46a98,98,0,0,0-16.85-1"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '4px',
                    }}
                  />
                  <path
                    className="brique-48"
                    data-name="brique"
                    d="M705.75,870.63a107.45,107.45,0,0,0-18.9,1.28"
                    style={{
                      fill: 'none',
                      stroke:
                        '#8c8c8c,stroke-linecap: round,stroke-miterlimit: 10',
                      strokeWidth: '4px',
                    }}
                  />
                </g>
                <path
                  className="col-12"
                  data-name="col"
                  d="M666.43,689.83l-21.15-37.11c38-11.91,118.68-10.38,151.83,0L776,689.83C745.83,680.13,695,680.38,666.43,689.83Z"
                  style={{ opacity: 0.2 }}
                />
                <g className="tower-windows">
                  <path
                    className="window-22"
                    data-name="window"
                    d="M756.24,758.19h-11.6V733.75c0-3.2,3.87-11.43,5.8-11.43s5.8,8.23,5.8,11.43Z"
                    style={{ fill: '#e2d600' }}
                  />
                  <path
                    className="window-edge-8"
                    data-name="window-edge"
                    d="M750.44,722.32a1.34,1.34,0,0,0-.69.29c2,1.45,5.11,8.28,5.11,11.14v24.44h1.38V733.75C756.24,730.55,752.38,722.32,750.44,722.32Z"
                    style={{ fill: '#494949' }}
                  />
                  <path
                    className="window-23"
                    data-name="window"
                    d="M682.92,758.5h11.61V734.06c0-3.21-3.87-11.43-5.81-11.43s-5.8,8.22-5.8,11.43Z"
                    style={{ fill: '#e2d600' }}
                  />
                  <path
                    className="window-edge-9"
                    data-name="window-edge"
                    d="M688.72,722.63a1.23,1.23,0,0,1,.69.29c-2,1.44-5.11,8.28-5.11,11.14V758.5h-1.38V734.06C682.92,730.85,686.79,722.63,688.72,722.63Z"
                    style={{ fill: '#494949' }}
                  />
                </g>
                <path
                  className="shadow-34"
                  data-name="shadow"
                  d="M645.28,652.72c38-11.91,118.68-10.38,151.83,0L776,689.83q-.69,11.59-1.27,23.38c-22-17.63-72-19.33-73.75,13.13-2.3,41.36-8,104.46,13,253.59a429.07,429.07,0,0,1-47.49-4.11c4.08-125.1,4.08-160.88,0-286Z"
                  style={{ opacity: 0.2 }}
                />
              </g>
            </g>
            <g className="ground">
              <path
                className="ground-2"
                data-name="ground"
                d="M153.88,1156.39C172.66,1035,406.36,919,511.06,922.13c87.83,2.64,845.31,3,890.54-1.23,134.6-12.6,334.21,106.95,395.49,247.74Z"
                style={{ fill: '#0b397c' }}
              />
              <polygon
                className="wall-ground-left"
                points="520.39 926.03 532.55 920.08 569.36 919.82 603.84 922.23 622.93 920.08 642.84 919.2 656.32 920.08 696.15 919.2 738.02 916.66 771.04 921.35 787.04 918.64 818.7 920.08 836.4 918.47 862.27 920.08 899.21 916.66 932.23 921.35 878.88 931.41 858.28 928 844.23 931.11 829.19 927.44 788.98 929.22 770.96 928.51 755.04 930.23 734.45 931.93 719.64 927.75 685.43 929.27 653.25 929.27 637.25 928.96 611.55 931.07 549.63 929.07 529.51 929.27 520.39 926.03"
                style={{ opacity: 0.2 }}
              />
              <polygon
                className="wall-ground-right"
                points="1004.58 926.03 1016.74 920.08 1053.55 919.82 1088.03 922.23 1107.12 920.08 1127.03 919.2 1140.51 920.08 1180.34 919.2 1222.21 916.66 1255.23 921.35 1271.23 918.64 1302.89 920.08 1320.59 918.47 1346.46 920.08 1383.4 916.66 1416.42 921.35 1363.07 931.41 1344.91 925.45 1330.79 928.78 1313.38 930.56 1270.36 928.85 1256.06 931.28 1238.02 927.15 1218.84 926.47 1204.68 929.27 1169.77 924.81 1137.44 929.27 1121 928.26 1095.74 931.07 1035.72 926.27 1013.7 929.27 1004.58 926.03"
                style={{ opacity: 0.2 }}
              />
              <g className="left-roof-tower-base">
                <path
                  className="left-roof-tower-back"
                  d="M482.09,899.73c-.23,11-.5,21.7-.83,31.79,20.52,2.88,39.53,3,56.82,0-.42-10.23-.79-20.92-1.1-31.88C523.64,901.72,494.15,902.15,482.09,899.73Z"
                  style={{ fill: '#00246b' }}
                />
                <path
                  className="left-base-roof-tower-back"
                  d="M482.09,899.73c-.23,11-.5,21.7-.83,31.79,20.52,2.88,39.53,3,56.82,0-.42-10.23-.79-20.92-1.1-31.88C523.64,901.72,494.15,902.15,482.09,899.73Z"
                  style={{ fill: '#5d5963' }}
                />
                <path
                  className="base-shadow"
                  d="M504.8,901.37c-9-.08-17.49-.59-22.71-1.64-.23,11-.5,21.7-.83,31.79a214.09,214.09,0,0,0,30.6,2.2C506.48,929.9,504.07,922,504.8,901.37Z"
                  style={{ opacity: 0.2 }}
                />
                <path
                  className="base-top-shadow"
                  d="M537,900.28c0-.21,0-.42,0-.64-13.34,2.08-42.83,2.51-54.89.09,0,.23,0,.45,0,.68C492.54,903.51,525.7,902.31,537,900.28Z"
                  style={{ opacity: 0.3 }}
                />
                <polygon
                  className="dirt"
                  points="479.98 931.66 483.47 930.11 497.6 932.51 512.49 931.58 529.17 932.51 536.89 929.12 540.06 932 536.89 934.22 531.98 933.73 519.04 936.51 503.55 936.51 491.04 934.64 479.47 933.66 479.98 931.66"
                  style={{ opacity: 0.2 }}
                />
              </g>
              <g className="right-roof-tower-base">
                <path
                  className="left-roof-tower-back-2"
                  data-name="left-roof-tower-back"
                  d="M1437.15,899.71c.22,11,.5,21.7.83,31.79-20.52,2.88-39.53,3-56.82,0,.42-10.23.79-20.92,1.1-31.88C1395.6,901.7,1425.09,902.13,1437.15,899.71Z"
                  style={{ fill: '#00246b' }}
                />
                <path
                  className="left-base-roof-tower-back-2"
                  data-name="left-base-roof-tower-back"
                  d="M1437.15,899.71c.22,11,.5,21.7.83,31.79-20.52,2.88-39.53,3-56.82,0,.42-10.23.79-20.92,1.1-31.88C1395.6,901.7,1425.09,902.13,1437.15,899.71Z"
                  style={{ fill: '#5d5963' }}
                />
                <path
                  className="base-shadow-2"
                  data-name="base-shadow"
                  d="M1414.44,901.35c9-.08,17.49-.6,22.71-1.64.22,11,.5,21.7.83,31.79a214.09,214.09,0,0,1-30.6,2.2C1412.76,929.88,1415.17,922,1414.44,901.35Z"
                  style={{ opacity: 0.2 }}
                />
                <path
                  className="base-top-shadow-2"
                  data-name="base-top-shadow"
                  d="M1382.24,900.26c0-.21,0-.42,0-.64,13.34,2.08,42.83,2.51,54.89.09,0,.22,0,.45,0,.68C1426.7,903.49,1393.54,902.29,1382.24,900.26Z"
                  style={{ opacity: 0.3 }}
                />
                <polygon
                  className="dirt-2"
                  data-name="dirt"
                  points="1379.79 931.66 1383.27 930.11 1397.4 932.51 1412.3 931.58 1428.98 932.51 1436.7 929.12 1439.87 932 1436.7 934.22 1431.79 933.73 1418.85 936.51 1403.36 936.51 1390.85 934.64 1379.27 933.66 1379.79 931.66"
                  style={{ opacity: 0.2 }}
                />
              </g>
              <g className="right-tower-base">
                <path
                  className="left-roof-tower-back-3"
                  data-name="left-roof-tower-back"
                  d="M1261.12,888.49c.45,15.35,1,30.15,1.64,44.17-40.32,4-77.69,4.18-111.66,0,.82-14.22,1.54-29.06,2.17-44.29C1179.48,891.26,1237.42,891.86,1261.12,888.49Z"
                  style={{ fill: '#00246b' }}
                />
                <path
                  className="left-base-roof-tower-back-3"
                  data-name="left-base-roof-tower-back"
                  d="M1261.12,888.49c.45,15.35,1,30.15,1.64,44.17-40.32,4-77.69,4.18-111.66,0,.82-14.22,1.54-29.06,2.17-44.29C1179.48,891.26,1237.42,891.86,1261.12,888.49Z"
                  style={{ fill: '#5d5963' }}
                />
                <path
                  className="base-shadow-3"
                  data-name="base-shadow"
                  d="M1216.49,890.77c17.72-.11,34.38-.82,44.63-2.28.45,15.35,1,30.15,1.64,44.17a597.22,597.22,0,0,1-60.14,3.05C1213.2,930.41,1217.94,919.47,1216.49,890.77Z"
                  style={{ opacity: 0.2 }}
                />
                <path
                  className="base-top-shadow-3"
                  data-name="base-top-shadow"
                  d="M1153.23,889.26c0-.3,0-.59,0-.89,26.21,2.89,84.15,3.49,107.85.12l0,1C1240.59,893.75,1175.44,892.08,1153.23,889.26Z"
                  style={{ opacity: 0.3 }}
                />
                <polygon
                  className="dirt-3"
                  data-name="dirt"
                  points="1148.4 932.88 1155.25 930.73 1183.02 934.06 1212.28 932.76 1245.07 934.06 1260.23 929.35 1266.47 933.36 1260.23 936.43 1250.58 935.75 1225.16 939.62 1194.72 939.62 1170.14 937.02 1147.39 935.65 1148.4 932.88"
                  style={{ opacity: 0.2 }}
                />
              </g>
              <g className="left-tower-base">
                <path
                  className="left-roof-tower-back-4"
                  data-name="left-roof-tower-back"
                  d="M666.89,888.61c-.45,15.35-1,30.15-1.64,44.17,40.32,4,77.69,4.18,111.66,0-.82-14.22-1.54-29.06-2.17-44.29C748.53,891.38,690.59,892,666.89,888.61Z"
                  style={{ fill: '#00246b' }}
                />
                <path
                  className="left-base-roof-tower-back-4"
                  data-name="left-base-roof-tower-back"
                  d="M666.89,888.61c-.45,15.35-1,30.15-1.64,44.17,40.32,4,77.69,4.18,111.66,0-.82-14.22-1.54-29.06-2.17-44.29C748.53,891.38,690.59,892,666.89,888.61Z"
                  style={{ fill: '#5d5963' }}
                />
                <path
                  className="base-shadow-4"
                  data-name="base-shadow"
                  d="M711.52,890.89c-17.72-.11-34.38-.82-44.63-2.28-.45,15.35-1,30.15-1.64,44.17a597.22,597.22,0,0,0,60.14,3.05C714.81,930.53,710.07,919.59,711.52,890.89Z"
                  style={{ opacity: 0.2 }}
                />
                <path
                  className="base-top-shadow-4"
                  data-name="base-top-shadow"
                  d="M774.78,889.38c0-.3,0-.59,0-.89-26.21,2.89-84.15,3.49-107.85.12l0,.95C687.42,893.87,752.58,892.2,774.78,889.38Z"
                  style={{ opacity: 0.3 }}
                />
                <polygon
                  className="dirt-4"
                  data-name="dirt"
                  points="779.62 933 772.76 930.85 745 934.18 715.73 932.88 682.95 934.18 667.78 929.47 661.54 933.48 667.78 936.55 677.43 935.88 702.85 939.74 733.29 939.74 757.87 937.14 780.62 935.77 779.62 933"
                  style={{ opacity: 0.2 }}
                />
              </g>
              <g className="trees">
                <g className="tree-right">
                  <path
                    className="tree-2"
                    data-name="tree"
                    d="M1680.48,676.44c24.21,5.22-28.21,293-41.15,330.26s-91.29,21.69-89-19.17S1656.26,671.23,1680.48,676.44Z"
                    style={{ fill: '#104687' }}
                  />
                  <path
                    className="shadow-35"
                    data-name="shadow"
                    d="M1684.23,680.83c13.87,36.84-32.79,291-44.9,325.87-13.7,39.11-97.75,19.85-88.39-24.19C1631.36,1055.12,1649.39,882,1684.23,680.83Z"
                    style={{ opacity: 0.2 }}
                  />
                  <path
                    className="light-3"
                    data-name="light"
                    d="M1557.24,992c2.22-39.39,98.56-296.71,127.2-310.57-1-2.89-2.29-4.61-4-5-24.22-5.21-127.83,270.22-130.13,311.09-.81,14.33,8.3,25.54,21,32.47C1562.41,1013.1,1556.59,1003.56,1557.24,992Z"
                    style={{ fill: '#f4e92c', opacity: 0.1 }}
                  />
                </g>
                <g className="tree-right-2" data-name="tree-right">
                  <path
                    className="tree-3"
                    data-name="tree"
                    d="M1535.27,833.67c10.15.67,6,120.72,3,136.65s-35.8,14.25-37.3-2.49S1525.12,833,1535.27,833.67Z"
                    style={{ fill: '#104687' }}
                  />
                  <path
                    className="shadow-36"
                    data-name="shadow"
                    d="M1537.05,835.22c7.84,14.15,4,120.19,1.19,135.1-3.24,16.71-38.54,13.89-37.36-4.56C1537.89,990.47,1534.89,919,1537.05,835.22Z"
                    style={{ opacity: 0.2 }}
                  />
                  <path
                    className="light-4"
                    data-name="light"
                    d="M1503.56,967.83c-1.43-16,21.88-124.2,32.84-133.52a1.7,1.7,0,0,0-1.13-.64c-10.15-.68-35.83,117.42-34.33,134.16.83,9.33,11.37,14,21.06,13.51C1513.12,980.93,1504.32,976.32,1503.56,967.83Z"
                    style={{ fill: '#f4e92c', opacity: 0.1 }}
                  />
                </g>
                <g className="tree-left">
                  <path
                    className="tree-4"
                    data-name="tree"
                    d="M362.1,731.75c-16.37,1.09-9.68,194.69-4.79,220.39s57.74,23,60.16-4S378.47,730.66,362.1,731.75Z"
                    style={{ fill: '#104687' }}
                  />
                  <path
                    className="shadow-37"
                    data-name="shadow"
                    d="M359.22,734.26c-12.63,22.81-6.49,193.84-1.91,217.88,5.22,27,62.15,22.41,60.26-7.36C357.88,984.64,362.71,869.43,359.22,734.26Z"
                    style={{ opacity: 0.2 }}
                  />
                  <path
                    className="light-5"
                    data-name="light"
                    d="M362.1,731.75a2.67,2.67,0,0,0-1.7.88c17.59,14,55.46,189.65,53.14,215.5-1.23,13.73-15.5,21.17-29.87,21.8,15.59.68,32.46-6.82,33.8-21.8C419.89,921.13,378.47,730.66,362.1,731.75Z"
                    style={{ fill: '#f4e92c', opacity: 0.1 }}
                  />
                </g>
                <g className="tree-left-2" data-name="tree-left">
                  <path
                    className="tree-5"
                    data-name="tree"
                    d="M270.39,691.79c-20.86,3.16,8.51,250.59,17.54,283s76.48,23.27,76.68-11.6S291.26,688.64,270.39,691.79Z"
                    style={{ fill: '#104687' }}
                  />
                  <path
                    className="shadow-38"
                    data-name="shadow"
                    d="M267,695.32c-13.74,30.6,12.52,249.14,21,279.46,9.59,34,82.07,22,76.44-15.9C292.15,1016.37,286,868.2,267,695.32Z"
                    style={{ opacity: 0.2 }}
                  />
                  <path
                    className="light-6"
                    data-name="light"
                    d="M270.39,691.79a4.31,4.31,0,0,0-2.85,2.42C293,719.3,357.18,930.6,357,963.18c-.11,18.84-19.86,30.17-39.42,31.48,21.67,1.53,46.92-10.17,47-31.48C364.81,928.31,291.26,688.64,270.39,691.79Z"
                    style={{ fill: '#f4e92c', opacity: 0.1 }}
                  />
                </g>
              </g>
              <polygon
                className="road"
                points="932.57 914.34 732.55 1160.84 1175.53 1160.84 992.35 913.09 932.57 914.34"
                style={{ fill: '#5d7d84' }}
              />
              <g className="border">
                <polygon
                  points="897.47 950.92 897.47 943.46 788.75 1034.54 721.19 1123.58 721.88 1154 897.47 950.92"
                  style={{ fill: '#3f3f3f' }}
                />
                <polygon
                  points="721.19 1123.58 680.49 1125.62 888.58 943.46 897.47 943.46 721.19 1123.58"
                  style={{ fill: '#666' }}
                />
                <polygon
                  points="1022.63 950.08 1022.63 942.63 1121.65 1034.54 1189.2 1123.58 1188.51 1154 1022.63 950.08"
                  style={{ fill: '#3f3f3f' }}
                />
                <polygon
                  points="1189.2 1123.58 1229.91 1125.62 1031.53 942.63 1022.63 942.63 1189.2 1123.58"
                  style={{ fill: '#666' }}
                />
              </g>
            </g>
            <g className="castle">
              <path
                className="castle-2"
                data-name="castle"
                d="M1030.78,787.41l3,0a36.64,36.64,0,0,0,8.18-16.44h0q-81.9-2.37-163.76,0h0a45.19,45.19,0,0,0,8.18,16.44l2.87,0a763.79,763.79,0,0,1,8.37,126.47c-4.64,1.88-10.72,3-18.68,2.78l4.17,20.86h20.31v.08h113.52v-.08h20.3l4.18-20.86c-8.34.21-14.61-1-19.32-3C1020.33,872.49,1023.44,830.38,1030.78,787.41Z"
                style={{ fill: '#00246b' }}
              />
              <g
                className="shad-grpe-10"
                data-name="shad-grpe"
                style={{ opacity: 0.85 }}
              >
                <path
                  className="wall-8"
                  data-name="wall"
                  d="M888.58,783.3a764.4,764.4,0,0,1,8.62,145.12h125.66c-3.32-47.11-.15-95.54,8.62-145.12Z"
                  style={{ fill: '#605f60' }}
                />
                <path
                  className="shadow-39"
                  data-name="shadow"
                  d="M1031.48,783.3H888.58a764.4,764.4,0,0,1,8.62,145.12h10.35c-5.26-47.71-8.24-125.07-1.32-129.49,7.92-5.06,85.87-6.79,98.61-1.76s10.61,99.1,1.68,131.25h16.34C1019.54,881.31,1022.71,832.88,1031.48,783.3Z"
                  style={{ opacity: 0.2 }}
                />
                <g className="stairs">
                  <g className="rampes">
                    <path
                      className="edge-top"
                      d="M1008.35,888l-4.06-1.31C953.17,900,967,900.08,916,886.69L911.9,888s5.56,29.64-33,28.66l4.17,20.86h154.13l4.18-20.86C1002.8,917.64,1008.35,888,1008.35,888Z"
                      style={{ fill: '#4f4f4f' }}
                    />
                    <path
                      className="edge-front"
                      d="M1016.89,918.23c-18.23-.18-122.49,1.38-138-1.57l4.17,20.86h154.13l4.18-20.86Z"
                      style={{ fill: '#5b5b5b' }}
                    />
                    <g className="dirt-5" data-name="dirt">
                      <polygon
                        className="dirt-6"
                        data-name="dirt"
                        points="883.06 937.52 968.33 937.52 938.53 935.92 918.53 935.92 905.85 935.92 892.91 936.46 886.79 934.23 882.72 935.82 883.06 937.52"
                        style={{ fill: '#00246b' }}
                      />
                      <polygon
                        className="dirt-7"
                        data-name="dirt"
                        points="1037.19 937.52 1037.73 934.82 1027.08 936.71 1022.63 933.53 1016.05 937.52 1037.19 937.52"
                        style={{ fill: '#00246b' }}
                      />
                    </g>
                    <path
                      className="stairs-2"
                      data-name="stairs"
                      d="M1004.29,886.69c-48.56,10.48-39.91,10.34-88.33,0,0,0,1.5,28-12.59,31.66V937.6h113.52V918.35C1002.8,914.7,1004.29,886.69,1004.29,886.69Z"
                      style={{ fill: '#424142' }}
                    />
                  </g>
                  <polygon
                    className="stair"
                    points="1001.53 924.77 1001.53 913.5 995.11 913.5 995.11 900.38 924.95 900.38 924.95 913.5 918.53 913.5 918.53 924.77 911.9 924.77 911.9 937.61 1008.16 937.61 1008.16 924.77 1001.53 924.77"
                    style={{ fill: '#605f60' }}
                  />
                  <g className="lights">
                    <rect
                      className="light-7"
                      data-name="light"
                      x="918.53"
                      y="913.09"
                      width="83"
                      height="1.25"
                      style={{ fill: '#7a7a7a' }}
                    />
                    <rect
                      className="light-8"
                      data-name="light"
                      x="911.9"
                      y="924.32"
                      width="96.26"
                      height="1.25"
                      style={{ fill: '#7a7a7a' }}
                    />
                    <rect
                      className="light-9"
                      data-name="light"
                      x="924.95"
                      y="900.38"
                      width="70.17"
                      height="1.25"
                      style={{ fill: '#7a7a7a' }}
                    />
                  </g>
                </g>
                <g className="door">
                  <path
                    className="door-2"
                    data-name="door"
                    d="M960,838.88c-24.49,7-18.31,37.62-18.88,61.48h37.76C978.36,876.38,984.46,845.88,960,838.88Z"
                    style={{ fill: '#494949' }}
                  />
                  <path
                    className="light-10"
                    data-name="light"
                    d="M960,843.28c-20.49,7-15.2,36.18-15.7,57.08h31.4C975.25,879.37,980.48,850.25,960,843.28Z"
                    style={{ fill: '#e2d600' }}
                  />
                </g>
                <g className="windows-6" data-name="windows">
                  <path
                    className="window-edges"
                    d="M927,855.6a174.85,174.85,0,0,0-2.49-37h-8.35a174.71,174.71,0,0,1,2.27,37Z"
                    style={{ fill: '#494949' }}
                  />
                  <path
                    className="window-24"
                    data-name="window"
                    d="M926.42,852.7a164.08,164.08,0,0,0-1.86-31.24h-5.79a164.08,164.08,0,0,1,1.86,31.24Z"
                    style={{ fill: '#e2d600' }}
                  />
                  <path
                    className="window-edges-2"
                    data-name="window-edges"
                    d="M993.14,856.26c-.5-13.58.94-24.28,2.13-37.7h8.93c-2.26,13.25-3.2,24.11-2,37.7Z"
                    style={{ fill: '#494949' }}
                  />
                  <path
                    className="window-25"
                    data-name="window"
                    d="M993.64,852.7a164.08,164.08,0,0,1,1.86-31.24h5.79a164.08,164.08,0,0,0-1.86,31.24Z"
                    style={{ fill: '#e2d600' }}
                  />
                </g>
                <g className="top">
                  <path
                    className="top-2"
                    data-name="top"
                    d="M1033.73,787.43q-73.69-.79-147.4,0A44.27,44.27,0,0,1,878.15,771q81.9-2.37,163.76,0A36,36,0,0,1,1033.73,787.43Z"
                    style={{ fill: '#605f60' }}
                  />
                  <path
                    className="edge-light"
                    d="M887.38,772.47c49.65,2.64,107.43-8.94,153.26,3.08a37.54,37.54,0,0,0,1.27-4.56q-81.9-2.37-163.76,0a51.25,51.25,0,0,0,3.87,9.88C880.25,774.68,880.54,772.41,887.38,772.47Z"
                    style={{ fill: '#6d6d6d' }}
                  />
                  <g
                    className="shadow-40"
                    data-name="shadow"
                    style={{ opacity: 0.30000000000000004 }}
                  >
                    <path d="M1018.35,784.3c-40.28-1.82-81.84-.89-122.7.14-5.47.14-12.19-4.63-16.32-9.79a41.85,41.85,0,0,0,7,12.78q73.71-.78,147.4,0a35.9,35.9,0,0,0,7.9-15.27C1036.77,778.7,1029.74,784.81,1018.35,784.3Z" />
                  </g>
                </g>
              </g>
              <g className="blason">
                <path
                  className="blason-2"
                  data-name="blason"
                  d="M1009,703a3.8,3.8,0,0,0,1.24-3.37h0a8.94,8.94,0,0,0-1.16-2.69q-6.5-.36-13-.62a25.53,25.53,0,0,0-1.29-5.44,187.78,187.78,0,0,0-30-3.16l.1-9.18a19.49,19.49,0,0,0-9.86,0v.48h0l.09,8.71c-1.89.06-3.78.14-5.67.25h0a203.44,203.44,0,0,0-24.32,2.9,29.31,29.31,0,0,0-1.08,5.44q-6.6.25-13.19.62c-1.79,2.29-1.95,4.71.41,6.45q6.16-.33,12.32-.59c-2.24,24.22,11.47,49,32.24,53.9l.19,18.36h7.86l.19-18.37c19.7-4.43,34.82-30.52,32.53-53.88q6,.25,12,.58Z"
                  style={{ fill: '#00246b' }}
                />
                <g
                  className="shad-grpe-11"
                  data-name="shad-grpe"
                  style={{ opacity: 0.85 }}
                >
                  <g className="montant">
                    <path
                      className="vertical"
                      d="M963.93,775.1h-7.86l-1-96.52a19.49,19.49,0,0,1,9.86,0Z"
                      style={{ fill: '#6b5934' }}
                    />
                    <path
                      className="shadow-vert"
                      d="M955.07,678.58v.48c14.74-2.19,5.44,23.45,6.87,96h2l1-96.52A19.49,19.49,0,0,0,955.07,678.58Z"
                      style={{ opacity: 0.2 }}
                    />
                    <path
                      className="horizontal"
                      d="M1008.68,703.43a888.21,888.21,0,0,0-97.36,0c-2.33-2.09-2.47-3.36-.41-6.45a893.2,893.2,0,0,1,98.18,0C1011.22,700.61,1010.27,701.5,1008.68,703.43Z"
                      style={{ fill: '#6b5934' }}
                    />
                    <path
                      className="shadow-horiz"
                      d="M909.9,698.74c-.86,1.9-.4,3,1.42,4.69a888.21,888.21,0,0,1,97.36,0c1.1-1.33,1.89-2.17,1.57-3.76C1009,702.33,909.77,704.28,909.9,698.74Z"
                      style={{ opacity: 0.2 }}
                    />
                  </g>
                  <path
                    className="shield"
                    d="M960,757.31c-31-2.51-41.48-45.16-34.82-66.39a189.58,189.58,0,0,1,69.64,0C1002.56,711.88,989.5,755.16,960,757.31Z"
                    style={{ fill: '#090970' }}
                  />
                  <path
                    className="liseret"
                    d="M960,752.91c-27.12-2.19-36.24-39.45-30.42-58a165.64,165.64,0,0,1,60.83,0C997.2,713.22,985.79,751,960,752.91Z"
                    style={{
                      fill: 'none',
                      stroke: '#1153bc',
                      strokeMiterlimit: 10,
                    }}
                  />
                  <path
                    className="shadow-41"
                    data-name="shadow"
                    d="M994.82,690.92a185.42,185.42,0,0,0-24-2.91c15.35,3.54,17.66,10.73,14.65,26.23-5.79,29.79-25.62,33-25.62,33s-21.53-5.1-26.63-34.21c-2-11.48-.89-20.65,16.24-25a199,199,0,0,0-24.32,2.9C911.11,778.35,1009.09,776.82,994.82,690.92Z"
                    style={{ opacity: 0.2 }}
                  />
                </g>
              </g>
            </g>
            <g className="torsh">
              <circle
                className="center-3"
                cx="1086.39"
                cy="847.14"
                r="6.7"
                style={{ fill: '#fda415' }}
              />
              <circle
                className="center-2"
                cx="1086.39"
                cy="847.14"
                r="5.62"
                style={{ fill: '#fde377' }}
              />
              <circle
                className="center-1"
                cx="1086.39"
                cy="847.14"
                r="4.15"
                style={{ fill: '#fdefd8' }}
              />
              <line
                className="pied"
                x1="1086.39"
                y1="945.6"
                x2="1086.39"
                y2="856.93"
                style={{
                  fill: 'none',
                  stroke: '#000',
                  strokeLinecap: 'round',
                  strokeMiterlimit: 10,
                }}
              />
              <path
                className="socle"
                d="M1086.39,856.39c-6,0-9.65-4.32-9.65-9.65H1096C1096,852.07,1092.42,856.39,1086.39,856.39Z"
                style={{ fill: '#262526' }}
              />
              <circle
                className="outer-1"
                cx="1086.39"
                cy="847.14"
                r="28.93"
                style={{ fill: '#f4e92c', opacity: 0.15 }}
              />
              <circle
                className="outer-2"
                cx="1086.39"
                cy="847.14"
                r="49.11"
                style={{ fill: '#f4e92c', opacity: 0.1 }}
              />
            </g>
            <g className="torsh" data-name="torsh">
              <circle
                className="center-3-2"
                data-name="center-3"
                cx="833.34"
                cy="847.14"
                r="6.7"
                style={{ fill: '#fda415' }}
              />
              <circle
                className="center-2-2"
                data-name="center-2"
                cx="833.34"
                cy="847.14"
                r="5.62"
                style={{ fill: '#fde377' }}
              />
              <circle
                className="center-1-2"
                data-name="center-1"
                cx="833.34"
                cy="847.14"
                r="4.15"
                style={{ fill: '#fdefd8' }}
              />
              <line
                className="pied-2"
                data-name="pied"
                x1="833.34"
                y1="945.6"
                x2="833.34"
                y2="856.93"
                style={{
                  fill: 'none',
                  stroke: '#000',
                  strokeLinecap: 'round',
                  strokeMiterlimit: 10,
                }}
              />
              <path
                className="socle-2"
                data-name="socle"
                d="M833.34,856.39c-6,0-9.65-4.32-9.65-9.65H843C843,852.07,839.37,856.39,833.34,856.39Z"
                style={{ fill: '#262526' }}
              />
              <circle
                className="outer-1-2"
                data-name="outer-1"
                cx="833.34"
                cy="847.14"
                r="28.93"
                style={{ fill: '#f4e92c', opacity: 0.15 }}
              />
              <circle
                className="outer-2-2"
                data-name="outer-2"
                cx="833.34"
                cy="847.14"
                r="49.11"
                style={{ fill: '#f4e92c', opacity: 0.1 }}
              />
            </g>
            <g className="door-light">
              <path
                className="door-light-2"
                data-name="door-light"
                d="M944.21,900v13.08h-8.44v11.26h-8.26V937.7h-8.32c-17,24.63,17,81.09,40.81,81.09s59-56.47,42.09-81.09h-9.42V924.34h-8.32V913.08h-8.56V900Z"
                style={{ fill: '#e2d600', opacity: 0.2 }}
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
