import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';
import usePerformanceMonitor from '../../hooks/usePerformanceMonitor';
import * as S from '../../styles/common';

const WorkerOnPage = () => {
  const [isModelInitialized, setIsModelInitialized] = useState(false);
  const [inferenceTime, setInferenceTime] = useState(null);
  const videoElement = useRef(null);
  const canvasElement = useRef(null);
  const workerRef = useRef(null);

  const {
    startMeasurement,
    measureFirstDraw,
    collectData,
    analyzePerformance,
    reset,
    performanceResult,
  } = usePerformanceMonitor();

  const moveToSwitchModePage = () => {
    window.location.href = '/worker-test';
  };

  useEffect(() => {
    const worker = new Worker(new URL('./worker.js', import.meta.url), {
      type: 'module',
    });
    workerRef.current = worker;

    worker.onmessage = event => {
      if (event.data.type === 'ready') {
        worker.postMessage({ type: 'initialize' });
      } else if (event.data.type === 'initialized') {
        setIsModelInitialized(true);
      } else if (event.data.type === 'results') {
        drawResults(event.data.results);
        setInferenceTime(event.data.inferenceTime);
        collectData(event.data.inferenceTime);
        requestAnimationFrame(detectPose);
      } else if (event.data.type === 'stopped') {
        const result = analyzePerformance();
        console.log('==========Performance Analysis=========');
        console.log(result);
      }
    };

    worker.onerror = error => {
      console.error('Worker error:', error);
    };

    return () => {
      console.log('Terminating worker');
      worker.terminate();
    };
  }, [collectData, analyzePerformance, reset]);

  useEffect(() => {
    if (isModelInitialized && videoElement.current) {
      videoElement.current.src =
        process.env.PUBLIC_URL + '/sample_stretching.mp4';

      videoElement.current.onloadeddata = () => {
        videoElement.current
          .play()
          .then(() => {
            startMeasurement();
            requestAnimationFrame(detectPose);
          })
          .catch(error => {
            console.error('<Main Thread> Error playing video:', error);
          });
      };

      videoElement.current.onended = () => {
        console.log('<Main Thread> Video ended');
        cancelAnimationFrame(detectPose);
        workerRef.current.postMessage({ type: 'stop' });
      };
    }
  }, [isModelInitialized, startMeasurement]);

  const detectPose = async () => {
    if (videoElement.current.paused || videoElement.current.ended) {
      return;
    }

    createImageBitmap(videoElement.current)
      .then(imageBitmap => {
        workerRef.current.postMessage({ type: 'detect', image: imageBitmap }, [
          imageBitmap,
        ]);
      })
      .catch(error => {
        console.error('Error creating image bitmap');
        setTimeout(() => {
          requestAnimationFrame(detectPose);
        }, 0);
      });
  };

  const drawResults = results => {
    if (!canvasElement.current) return;

    measureFirstDraw();

    const canvasCtx = canvasElement.current.getContext('2d');
    canvasCtx.save();
    canvasCtx.clearRect(
      0,
      0,
      canvasElement.current.width,
      canvasElement.current.height,
    );

    if (results.landmarks) {
      for (const landmarks of results.landmarks) {
        drawConnectors(canvasCtx, landmarks, POSE_CONNECTIONS, {
          color: '#00FF00',
          lineWidth: 4,
        });
        drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
      }
    }
    canvasCtx.restore();
  };

  return (
    <S.PageWrapper>
      <S.Head>
        {'< '}WebWorkerTest{' >'}
      </S.Head>
      <S.Button
        onClick={() => moveToSwitchModePage()}
        style={{ backgroundColor: 'yellow' }}
      >
        switch-mode
      </S.Button>
      <VideoCanvas>
        <Video ref={videoElement} playsInline muted />
        <Canvas ref={canvasElement} width="360" height="640" />
      </VideoCanvas>
      <div>
        {inferenceTime && <p>Inference Time: {inferenceTime.toFixed(2)} ms</p>}
      </div>
      {performanceResult && (
        <div>
          <h3>---- Performance Analysis ----</h3>
          <p>
            Average Inference Time:{' '}
            {performanceResult.avgInferenceTime.toFixed(2)} ms
          </p>
          <p>
            Max Inference Time: {performanceResult.maxInferenceTime.toFixed(2)}{' '}
            ms
          </p>
          <p>
            Min Inference Time: {performanceResult.minInferenceTime.toFixed(2)}{' '}
            ms
          </p>
          <p>FPS: {performanceResult.fps.toFixed(2)}</p>
          <p>Total Frames: {performanceResult.totalFrames}</p>
          <p>Total Time: {(performanceResult.totalTime / 1000).toFixed(2)} s</p>
          <p>
            Delay until first draw:{' '}
            {performanceResult.firstDrawDelay?.toFixed(2)} ms
          </p>
        </div>
      )}
    </S.PageWrapper>
  );
};

export default WorkerOnPage;

const VideoCanvas = styled.div`
  position: relative;
  width: 360px;
  height: 640px;
`;

const Video = styled.video`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Canvas = styled.canvas`
  position: absolute;
  width: 100%;
  height: 100%;
`;
