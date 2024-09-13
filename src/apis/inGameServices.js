import axios from 'axios';
import { CONFIGS } from '../config';

const API = axios.create({
  withCredentials: true,
  baseURL: CONFIGS.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getChallengeInfo = async ({ accessToken, challengeId }) => {
  const url = '/challenge';
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      challengeId: challengeId,
    },
  };
  return await API.get(url, config);
};

const sendEnteredTime = async ({ accessToken, userId }) => {
  const url = `in-game/enter/${userId}`;
  console.log('===========>> SEND ENTERED TIME:: URL:: ', url);
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  return API.get(url, config);
};

const sendMyGameScore = async ({ accessToken, userData }) => {
  const { userId, userName, challengeId, gameScore: score } = userData;
  const url = `/in-game/score`;
  const payload = {
    userId,
    userName,
    challengeId,
    score,
  };
  console.log('============>> GAME SCORE PAYLOAD:: ', payload);
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  return API.post(url, payload, config);
};

const getGameResults = async ({ accessToken, challengeId }) => {
  const url = `in-game/result/${challengeId}`;
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  return API.get(url, config);
};

export const inGameServices = {
  getChallengeInfo,
  sendEnteredTime,
  sendMyGameScore,
  getGameResults,
};
