import React, { useContext, useEffect, useRef } from 'react';

import waitingMusic from '../../../assets/bgm/waiting_room.mp3';
import missionMusic from '../../../assets/bgm/ingame_music.mp3';
import resultMusic from '../../../assets/bgm/result_music.mp3';

import { GameContext } from '../../../contexts';

const AUDIO_SOURCE_PATH = {
  waiting: waitingMusic,
  mission: missionMusic,
  result: resultMusic,
};

const getMusicSrc = gameMode => {
  if (gameMode === 0) {
    return AUDIO_SOURCE_PATH.waiting;
  } else if (gameMode === 7) {
    return AUDIO_SOURCE_PATH.result;
  } else {
    return AUDIO_SOURCE_PATH.mission;
  }
};

const DEFAULT_VOLUME = 0.02;

const fadeAudio = (audio, type, duration = 3000) => {
  const maxVolume = DEFAULT_VOLUME;
  const interval = 50;
  const step = maxVolume / (duration / interval);
  let currentVolume = type === 'in' ? 0 : audio.volume;

  const fade = setInterval(() => {
    if (type === 'in') {
      currentVolume = Math.min(currentVolume + step, maxVolume);
      audio.volume = currentVolume;
      if (currentVolume >= maxVolume) {
        clearInterval(fade);
        audio.volume = maxVolume;
      }
    } else if (type === 'out') {
      currentVolume = Math.max(currentVolume - step, 0);
      audio.volume = currentVolume;
      if (currentVolume <= 0) {
        clearInterval(fade);
        audio.pause();
        audio.volume = maxVolume;
      }
    }
  }, interval);
};

const BackgroundMusic = () => {
  const { isMusicMuted, inGameMode } = useContext(GameContext);
  const audioRef = useRef(null);

  useEffect(() => {
    const newSrc = getMusicSrc(inGameMode);

    if (audioRef.current) {
      audioRef.current.volume = DEFAULT_VOLUME;
    }

    if (isMusicMuted) {
      audioRef.current.pause();
      return;
    } else if (inGameMode === 0 || inGameMode === 7) {
      audioRef.current.src = newSrc;
      audioRef.current.play();
    } else if (inGameMode === 1) {
      audioRef.current.src = newSrc;
      audioRef.current.play();
    }
  }, [inGameMode, isMusicMuted]);

  return <audio ref={audioRef} loop autoPlay playsInline />;
};

export default BackgroundMusic;
