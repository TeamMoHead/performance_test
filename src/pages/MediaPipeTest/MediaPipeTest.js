import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  OpenViduContext,
  GameContext,
  UserContext,
  AccountContext,
} from '../../contexts';
import MusicController from './MusicController';
import MyVideo from './components/MyVideo';
import MateVideo from './components/MateVideo';
import * as S from '../../styles/common';
import styled, { css } from 'styled-components';

const MediaPipeTest = () => {
  const navigate = useNavigate();
  const { userId: myId } = useContext(AccountContext);
  const { videoSession, myStream, mateStreams, setStartVideo } =
    useContext(OpenViduContext);
  const { challengeData } = useContext(UserContext);
  const { startModelWarmUp, startFirstMission } = useContext(GameContext);
  const [isVideoStarted, setIsVideoStarted] = useState(false);

  const [mateList, setMateList] = useState([]);
  const [FPS, setFPS] = useState(null);

  useEffect(() => {
    if (challengeData) {
      setMateList(challengeData?.mates?.filter(mate => mate.userId !== myId));
    } else return;
  }, [challengeData]);

  const stopTest = () => {
    if (videoSession) {
      videoSession.off('streamCreated');
      videoSession.disconnect();
    }
    // if (myStream) {
    //   myStream.dispose();
    //   mateStreams.forEach(stream => stream.dispose());
    // }
    setStartVideo(false);
    navigate('/main');
  };

  const measureFPS = () => {
    window.getFPS(15000).then(fps => setFPS(fps));
  };

  const startVideo = () => {
    setStartVideo(true);
    measureFPS();
    setIsVideoStarted(true);
    console.log('[TEST PAGE] => Video Started');
  };

  const loadModel = () => {
    startModelWarmUp();
    measureFPS();
    console.log('[TEST PAGE] => Model Loaded');
  };

  const realTimeInference = () => {
    startFirstMission();
    measureFPS();
    console.log('[TEST PAGE] => Real Time Inference');
  };

  return (
    <S.PageWrapper>
      <S.Head>MediaPipe Test</S.Head>
      <S.Button onClick={() => stopTest()} style={{ backgroundColor: 'red' }}>
        stop-test
      </S.Button>
      <S.Button
        onClick={() => measureFPS()}
        style={{ backgroundColor: 'lightGreen' }}
      >
        measure-fps
      </S.Button>
      {FPS && <span>FPS-Result: {FPS}</span>}
      <ButtonArea>
        <S.Button
          onClick={() => startVideo()}
          style={{ backgroundColor: 'violet' }}
        >
          start-video
        </S.Button>
        <S.Button
          onClick={() => loadModel()}
          style={{ backgroundColor: 'cyan' }}
        >
          load-model
        </S.Button>
        <S.Button
          onClick={() => realTimeInference()}
          style={{ backgroundColor: 'yellow' }}
        >
          real-time-inference
        </S.Button>
      </ButtonArea>
      {isVideoStarted && (
        <VideoArea $hasMate={mateList?.length > 0}>
          <>
            <MusicController />
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
    </S.PageWrapper>
  );
};

export default MediaPipeTest;

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
