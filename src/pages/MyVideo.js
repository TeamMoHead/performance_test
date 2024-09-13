import React, { useContext, useState, useEffect } from 'react';
import { GameContext, OpenViduContext } from '../contexts';

import { LoadModel, Waiting, Mission1, Mission2 } from './Modes';
import { LoadingWithText } from '../components';
import styled from 'styled-components';

const GAME_MODE = {
  100: 'loadModel',
  0: 'waiting',
  1: 'mission1',
  2: 'mission2',
  3: 'end',
};

const GAME_MODE_COMPONENTS = {
  100: <LoadModel />,
  0: <Waiting />,
  1: <Mission1 />,
  2: <Mission2 />,
  3: <div>END</div>,
};

const MyVideo = () => {
  const { myVideoRef, myStream } = useContext(OpenViduContext);
  const { myMissionStatus, inGameMode } = useContext(GameContext);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  useEffect(() => {
    if (myVideoRef && myStream) {
      myStream.addVideoElement(myVideoRef.current);
    }
  }, [myStream, myVideoRef]);

  useEffect(() => {
    const handleVideoLoading = () => {
      setIsVideoLoading(false);
    };

    if (myVideoRef.current) {
      myVideoRef.current.addEventListener('playing', handleVideoLoading);
    }

    return () => {
      if (myVideoRef.current) {
        myVideoRef.current.removeEventListener('playing', handleVideoLoading);
      }
    };
  }, [myVideoRef]);

  return (
    <Wrapper>
      {isVideoLoading && (
        <LoadingWithText loadingMSG="카메라를 인식 중이에요" />
      )}

      {GAME_MODE[inGameMode] !== 'end' && (
        <React.Fragment key={inGameMode}>
          {GAME_MODE_COMPONENTS[inGameMode]}
        </React.Fragment>
      )}

      <Video
        ref={myVideoRef}
        autoPlay
        playsInline
        $myMissionStatus={myMissionStatus}
        $isWaitingMode={GAME_MODE[inGameMode] === 'waiting'}
        $isLoadingModelMode={GAME_MODE[inGameMode] === 'loadModel'}
        $isResultMode={GAME_MODE[inGameMode] === 'end'}
        $amTheTopUser={true}
      />
    </Wrapper>
  );
};

export default MyVideo;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
`;

const Video = styled.video`
  display: ${({ $isLoadingModelMode }) =>
    $isLoadingModelMode ? 'none' : 'block'};

  position: absolute;
  top: 0;

  width: 100%;
  height: 100%;

  border-radius: 30px;
  border: ${({ $isWaitingMode, $myMissionStatus, $isResultMode }) =>
    $isWaitingMode
      ? `solid 3px white`
      : $isResultMode
        ? `solid 3px transparent`
        : $myMissionStatus
          ? `solid 3px skyblue`
          : `solid 3px pink`};

  object-fit: cover;

  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg);
  -moz-transform: rotateY(180deg);
`;
