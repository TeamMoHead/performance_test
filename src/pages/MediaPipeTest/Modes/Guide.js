import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';

const time = {
  missionFinish: 27000,
  afterCheckCorrect: 500,
  // afterFlip: 500,
};

const Guide = ({ poseCorrect, isFlipTriggered, progress }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [color, setColor] = useState('#F0F3FF');
  const [gradientProgress, setGradientProgress] = useState(0);
  const [stopOpacity, setStopOpacity] = useState(1);

  const latestPoseCorrect = useRef(poseCorrect); // useRef를 사용하여 최신 poseCorrect를 저장

  useEffect(() => {
    if (!poseCorrect.active) {
      setColor('#F0F3FF');
    } else {
      setColor('#15F5BA');
    }
    latestPoseCorrect.current = poseCorrect;
  }, [poseCorrect.active]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // if (
      //   latestPoseCorrect.current.direction === 'left' &&
      //   !latestPoseCorrect.current.active
      // ) {
      //   setColor('#FF008F');
      // }
      // setTimeout(() => {
      setIsFlipped(isFlipTriggered);
      // }, time.afterCheckCorrect);
      // setTimeout(() => {
      //   setColor('#F0F3FF');
      // }, time.afterFlip);
    }, time.afterCheckCorrect);
    return () => clearTimeout(timer);
  }, [isFlipTriggered]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!latestPoseCorrect.current.active) {
        setColor('#FF008F');
      }
    }, time.missionFinish);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setGradientProgress(progress);
    setStopOpacity(0.85);
  }, [progress]);

  return (
    <GuideWrapper $isFlipped={isFlipped}>
      <StyledSVG
        preserveAspectRatio="xMaxYMax meet"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="230 0 100 480"
        $color={color}
        $isFlipped={isFlipped}
        progress={gradientProgress}
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop
              offset={`${gradientProgress}%`}
              style={{
                stopColor: '#15F5BA',
                stopOpacity: stopOpacity,
              }}
            />
            <stop
              offset={`${gradientProgress}%`}
              style={{
                stopColor: '#F0F3FF',
                stopOpacity: 0.5,
              }}
            />
          </linearGradient>
        </defs>
        <g transform="rotate(10)">
          <path
            id="svg_2"
            d="m103.97994,158.37206c63.35393,101.32084 69.68794,141.79846 121.28345,169.48328c4.9,7.4 21.59889,26.2197 24.79889,35.7197c3.6,10.1 3.7,21.4 0.7,40c-1.5,8.5 -2.7,19.8 -2.9,25l-0.3,9.5l5.7,0.3l5.7,0.3l0.3,-8.8l0.3,-8.8l62.4,-0.3c49.3,-0.2 62.60001,0 63.30001,1c0.4,0.7 0.8,4.8 0.8,9l0,7.8l5.5,0l5.5,0l0,-9.6c0,-5.3 -1.1,-17.3 -2.4,-26.7c-2.1,-14.9 -2.5,-22.4 -3.1,-55.7c1.57746,-169.06042 -81.43769,-210.03935 -166.3047,-288.67261c-29.32978,-24.53256 -32.88212,-6.00383 -77.66263,23.5791c-45.81701,32.84487 -72.0286,35.34676 -43.61503,76.89053zm83.98788,-90.91167c15.9668,-12.05347 22.67432,-10.52669 39.87568,6.43219l95.43123,93.46924c-11.18583,12.34162 -12.72953,12.80206 -23.32044,21.11302c-12.70309,-16.24399 -27.24928,-34.57827 -36.90876,-44.49834l-59.39375,-61.53463l-37.76478,21.82072c-6.16338,-10.08366 -14.85538,-12.1019 -5.81634,-17.86565c12.17971,-7.95828 17.56931,-12.83014 27.89717,-18.93656zm-30.25782,42.79477l-28.95279,29.17139l39.14702,60.61482c9.80433,13.81628 36.55805,53.33367 36.35805,53.93367c-0.1,0.6 -2.8,8.2 -5.9,16.9l-3.28029,11.16059c-24.64365,-39.24355 -57.92929,-88.98093 -82.57294,-128.22448c-11.83173,-18.80048 -15.11556,-22.95125 1.22352,-34.62658c16.33908,-11.67534 28.10964,-20.94994 34.36949,-23.54652l9.60794,14.61711zm101.9931,43.38458c13.00304,16.21515 38.65918,46.6353 38.65918,48.1353c0,4.5 -2.8,7.5 -8.6,9.4c-7.7,2.4 -11.4197,-0.91971 -11.1197,-8.61971c1.2,-29.8 -25.2803,-55.28029 -51.8803,-49.98029c-18.8,3.7 -30.7,18.7 -30.7,39c0,22 15.1,42.7 35.9,49c6.3,2 6.7,2.3 9.4,7.3c2.7,5.1 2.7,5.2 0.9,7.7c-2.5,3.4 -12.60841,6.10754 -24.2331,-4.45172l-77.77486,-110.45678l13.54921,-13.33202l15.26245,-12.37676l11.00741,-7.37004c3.73978,-3.57956 18.50603,-11.47032 22.60603,-12.47032l57.02368,58.52235zm-11.84082,13.9353c7.8,4.1 13.5,10.2 17.5,18.8c2.9,6.1 3.2,7.5 3.2,16.7c0,11.2 -1.5,15.3 -7.7,21.2c-4.7,4.5 -9.6,6.3 -17.5,6.3c-8.6,0 -16.8,-3.6 -23.4,-10.4c-15.3,-15.5 -16.7,-39.3 -3,-50.7c5.5,-4.7 9.5,-5.9 17.7,-5.5c5.6,0.2 8.2,0.9 13.2,3.6zm92.5,23.5c18.8,32.7 24.90695,43.87787 32.1697,75.58642c7.26275,31.70855 8.48216,34.98642 8.98216,77.08642c0.4,37.5 -0.05185,54.02716 2.24815,63.52716l0.5,2.3l-60.90001,0c-33.5,0 -61.2,-0.2 -61.5,-0.5c-0.3,-0.3 0.1,-3.6 0.8,-7.3c2.6,-14 2.8,-24 0.5,-33.6c-3.6,-15.1 -13.88272,-28.42346 -22.98272,-40.32346c-1.7,-2.2 -7.43457,-10.65556 -16.26914,-14.45556c-12.8,-6.4 -21.44815,-17.92099 -21.04815,-19.92099c0.1,-0.8 2.8,-8.4 5.8,-17.1l5.6,-15.6l6,4.4c6.8,5 12.2,6.8 17.6,5.8c4.4,-0.8 7,-2 9.8,-4.5c1.9,-1.8 2.6,-1.9 9.2,-0.7c12.2,2.1 23.6,-1.5 32.3,-10.3c7.2,-7.1 8.5,-16.5 4.3,-30.6c-0.5,-2 0,-2.5 3.7,-4.2c11.6,-5 11.54166,-6.94239 10.36265,-23.16338c7.77247,-6.94371 22.13735,-18.73662 24.03735,-18.63662c0.68272,-0.41728 3.9,3.7 8.8,12.2zm-60.1,33.2c2.2,2.5 3.8,8.8 3.8,15.2c0,4.9 -0.3,5.6 -3.7,8.7c-5,4.6 -10.6,6.6 -17.6,6.2c-3.1,-0.2 -5.7,-0.5 -5.6,-0.8c0.1,-0.3 -1.2,-3 -3,-6.1l-3.1,-5.6l4.2,-1.2c6.3,-1.8 14.2,-7.6 18,-13.1c3.6,-5.4 4.7,-5.9 7,-3.3z"
            fill="url(#grad1)"
          />
        </g>
      </StyledSVG>
    </GuideWrapper>
  );
};

export default Guide;

const GuideWrapper = styled.div`
  z-index: 300;
  position: absolute;

  top: -18%;

  ${({ $isFlipped }) =>
    $isFlipped
      ? css`
          right: 0;
        `
      : css`
          left: -17%;
        `}

  width: 100%;
  height: 100%;

  border: 10px solid transparent;
`;

const StyledSVG = styled.svg`
  width: 120%;
  height: 120%;

  transition: 0.5s ease;

  path {
    transition: 1s ease;
  }
  transform: ${({ $isFlipped }) => ($isFlipped ? 'scaleX(-1)' : 'none')};
  z-index: 2;
`;
