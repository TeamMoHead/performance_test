import { useRef, useState, useCallback } from 'react';

const createPerformanceMonitor = () => {
  let performanceData = {
    inferenceTimes: [],
    startTime: 0,
    frameCount: 0,
    firstRequestTime: null,
    firstDrawTime: null,
  };

  const startMeasurement = () => {
    performanceData.firstRequestTime = performance.now();
    performanceData.startTime = performanceData.firstRequestTime;
    console.log('=====>First Request Time: ', performanceData.firstRequestTime);
  };

  const measureFirstDraw = () => {
    if (!performanceData.firstDrawTime) {
      performanceData.firstDrawTime = performance.now();
      console.log('=====>First Draw Time: ', performanceData.firstDrawTime);
    }
  };

  const collectData = inferenceTime => {
    performanceData.inferenceTimes.push(inferenceTime);
    performanceData.frameCount++;
  };

  const analyzePerformance = () => {
    const totalTime = performance.now() - performanceData.startTime;
    const avgInferenceTime =
      performanceData.inferenceTimes.reduce((a, b) => a + b, 0) /
      performanceData.frameCount;
    const maxInferenceTime = Math.max(...performanceData.inferenceTimes);
    const minInferenceTime = Math.min(...performanceData.inferenceTimes);
    const fps = 1000 / avgInferenceTime;

    return {
      avgInferenceTime,
      maxInferenceTime,
      minInferenceTime,
      fps,
      totalFrames: performanceData.frameCount,
      totalTime,
      firstRequestTime: performanceData.firstRequestTime,
      firstDrawTime: performanceData.firstDrawTime,
      firstDrawDelay:
        performanceData.firstDrawTime - performanceData.firstRequestTime,
    };
  };

  const reset = () => {
    performanceData = {
      inferenceTimes: [],
      startTime: 0,
      frameCount: 0,
      firstRequestTime: null,
      firstDrawTime: null,
    };
  };

  return {
    startMeasurement,
    measureFirstDraw,
    collectData,
    analyzePerformance,
    reset,
  };
};

const usePerformanceMonitor = () => {
  const monitorRef = useRef(createPerformanceMonitor());
  const [performanceResult, setPerformanceResult] = useState(null);

  const startMeasurement = useCallback(() => {
    monitorRef.current.startMeasurement();
  }, []);

  const measureFirstDraw = useCallback(() => {
    monitorRef.current.measureFirstDraw();
  }, []);

  const collectData = useCallback(inferenceTime => {
    monitorRef.current.collectData(inferenceTime);
  }, []);

  const analyzePerformance = useCallback(() => {
    const result = monitorRef.current.analyzePerformance();
    setPerformanceResult(result);
    return result;
  }, []);

  const reset = useCallback(() => {
    monitorRef.current.reset();
    setPerformanceResult(null);
  }, []);

  return {
    startMeasurement,
    measureFirstDraw,
    collectData,
    analyzePerformance,
    reset,
    performanceResult,
  };
};

export default usePerformanceMonitor;
