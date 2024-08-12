import React, { useContext, useState, useEffect } from 'react';
import {
  OpenViduContext,
  GameContext,
  MediaPipeContext,
  UserContext,
  AccountContext,
} from '../contexts';
import MyVideo from './MyVideo';
import MateVideo from './MateVideo';
import * as S from '../styles/common';
import styled, { css } from 'styled-components';

const TestPage = () => {
  const { userId: myId } = useContext(AccountContext);
  const { setStartVideo } = useContext(OpenViduContext);
  const { challengeData } = useContext(UserContext);
  const [isVideoStarted, setIsVideoStarted] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [isInferenceReady, setIsInferenceReady] = useState(false);
  const [mateList, setMateList] = useState([]);

  useEffect(() => {
    if (challengeData) {
      setMateList(challengeData?.mates?.filter(mate => mate.userId !== myId));
    } else return;
  }, [challengeData]);

  const startVideo = () => {
    setStartVideo(true);
    setIsVideoStarted(true);
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
      {isVideoStarted && (
        <VideoArea $hasMate={mateList?.length > 0}>
          <>
            <MyVideo />
            <MatesVideoWrapper $isSingle={mateList?.length === 1}>
              {mateList?.length > 0 &&
                mateList?.map(({ userId, userName }, idx) => (
                  <MateVideo key={idx} mateId={userId} mateName={userName} />
                ))}
            </MatesVideoWrapper>
          </>
        </VideoArea>
      )}
    </>
  );
};

export default TestPage;

const ButtonArea = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const VideoArea = styled.div`
  width: 100vw;
  height: 100vh;

  overflow: hidden;
  padding: 104px 24px 30px 24px;

  ${({ $hasMate }) =>
    $hasMate &&
    css`
      display: grid;
      grid-template-rows: auto 150px;
      gap: 10px;
      padding: 104px 24px 0px 24px;
    `};
`;

const MatesVideoWrapper = styled.div`
  width: 100%;
  height: 150px;

  ${({ theme, $isSingle }) =>
    $isSingle ? theme.flex.right : theme.flex.between}

  gap: 12px;
`;
