import React, { useContext } from 'react';
import { OpenViduContext, GameContext, MediaPipeContext } from './contexts';
import * as S from './styles/common';
import styled from 'styled-components';

const TestPage = () => {
  const { setStartVideo } = useContext(OpenViduContext);
  const startVideo = () => {
    setStartVideo(true);
    console.log('[TEST PAGE] => Video Started');
  };

  const loadModel = () => {
    console.log('[TEST PAGE] => Model Loaded');
  };

  const realTimeInference = () => {
    console.log('[TEST PAGE] => Real Time Inference');
  };

  return (
    <>
      <S.Head>TestPage</S.Head>
      <ButtonArea>
        <S.Button
          data-test-id="start-video"
          onClick={() => startVideo()}
          style={{ backgroundColor: 'violet' }}
        >
          Start Video
        </S.Button>
        <S.Button
          data-test-id="load-model"
          onClick={() => loadModel()}
          style={{ backgroundColor: 'cyan' }}
        >
          Load Model
        </S.Button>
        <S.Button
          data-test-id="real-time-inference"
          onClick={() => realTimeInference()}
          style={{ backgroundColor: 'yellow' }}
        >
          Real Time Inference
        </S.Button>
      </ButtonArea>
    </>
  );
};

export default TestPage;

const ButtonArea = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;
