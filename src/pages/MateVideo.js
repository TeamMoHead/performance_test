import React, { useEffect, useState, useContext, useRef } from 'react';
import { GameContext, OpenViduContext } from '../contexts';

import styled from 'styled-components';

const MateVideo = ({ mateId, mateName, onClick }) => {
  const mateVideoRef = useRef(null);
  const { mateStreams } = useContext(OpenViduContext);
  const { inGameMode, matesMissionStatus } = useContext(GameContext);
  const [thisMate, setThisMate] = useState(undefined);
  const [mateStatus, setMateStatus] = useState({
    online: false,
    missionCompleted: false,
  });

  useEffect(() => {
    if (mateStreams.length > 0) {
      const thisMate = mateStreams.find(
        mate => JSON.parse(mate.stream.connection.data).userId === `${mateId}`,
      );
      if (thisMate) {
        setThisMate(thisMate);
        setMateStatus(prev => ({ ...prev, online: thisMate?.stream.hasVideo }));
      } else {
        setThisMate(null);
        setMateStatus(prev => ({ ...prev, online: false }));
      }
    } else {
      setThisMate(null);
      setMateStatus(prev => ({ ...prev, online: false }));
    }
  }, [mateStreams]);

  useEffect(() => {
    if (mateStatus.online) {
      thisMate.addVideoElement(mateVideoRef.current);
    }
  }, [thisMate]);

  useEffect(() => {
    if (matesMissionStatus[mateId]) {
      setMateStatus(prev => ({
        ...prev,
        missionCompleted: matesMissionStatus[mateId].missionCompleted,
      }));
    }
  }, [matesMissionStatus]);

  return (
    <Wrapper onClick={onClick} $isWaitingRoom={inGameMode === 0}>
      {mateStatus.online ? (
        <Video
          ref={mateVideoRef}
          autoPlay
          playsInline
          $isCompleted={mateStatus.missionCompleted}
          $isNotGame={inGameMode === 0 || inGameMode === 7}
          $isWaitingRoom={inGameMode === 0}
        />
      ) : (
        <EmptyVideo>Zzz...</EmptyVideo>
      )}

      <UserName>{mateName}</UserName>
    </Wrapper>
  );
};

export default MateVideo;

const Wrapper = styled.div`
  position: relative;

  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;

  border-radius: 20px;
`;

const Video = styled.video`
  z-index: 100;
  position: absolute;
  width: 100%;
  height: 66%;
  object-fit: cover;

  border-radius: 20px;
  border: ${({ $isNotGame, $isCompleted }) =>
    $isNotGame
      ? `3px solid white`
      : $isCompleted
        ? `3px solid skyblue`
        : `3px solid pink`};

  // mirror mode
  will-change: transform;
  transform: rotateY(180deg) translateZ(0);
  -webkit-transform: rotateY(180deg);
`;

const UserName = styled.span`
  position: absolute;
  bottom: 23px;
  width: 140%;

  color: white;

  font-size: 13px;
  text-align: center;
`;

const EmptyVideo = styled.div`
  position: absolute;
  width: 100%;
  height: 66%;

  display: flex;
  justify-content: center;
  align-items: center;

  margin: auto;

  border-radius: 20px;
  border: 3px solid gray;

  color: gray;
  font-size: 20px;
`;
