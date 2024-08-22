import React, { useContext } from 'react';
import styled from 'styled-components';
import { Icon } from '../components';
import {
  BackgroundMusic,
  RoundSoundEffect,
  FailedSoundEffect,
  MissionSoundEffects,
} from './Sound';

import { GameContext } from '../contexts';

const MusicController = () => {
  const { inGameMode, isMusicMuted, setIsMusicMuted } = useContext(GameContext);
  const handleUnmute = () => {
    isMusicMuted ? setIsMusicMuted(false) : setIsMusicMuted(true);
  };

  const MUSIC_ON_BTN_STYLE = {
    size: 24,
    color: 'white',
    hoverColor: 'white',
  };

  const MUSIC_OFF_BTN_STYLE = {
    size: 38,
    color: 'purple',
    hoverColor: 'purple',
  };

  return (
    <>
      {inGameMode === 0 && (
        <BtnWrapper onClick={handleUnmute}>
          <Icon
            iconStyle={isMusicMuted ? MUSIC_OFF_BTN_STYLE : MUSIC_ON_BTN_STYLE}
            icon={isMusicMuted ? 'musicOff' : 'musicOn'}
          />
        </BtnWrapper>
      )}
      <BackgroundMusic />
      <MissionSoundEffects />
      <RoundSoundEffect />
      <FailedSoundEffect />
    </>
  );
};

export default MusicController;

const BtnWrapper = styled.div`
  z-index: 800;
  position: fixed;
  top: 125px;
  right: 40px;
`;
