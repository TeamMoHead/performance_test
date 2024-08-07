import axios from 'axios';
import { CONFIGS } from '../config.js';

const API = axios.create({
  baseURL: CONFIGS.BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const logInUser = async () => {
  const url = '/auth/login';
  const payload = {
    email: CONFIGS.TEST_EMAIL,
    password: CONFIGS.TEST_PASSWORD,
  };
  return await API.post(url, payload);
};

const refreshAccessToken = async ({ accessToken, refreshToken }) => {
  if (!accessToken) {
    accessToken = null;
  }
  const url = '/auth/refresh';
  const payload = {
    refreshToken: refreshToken,
  };
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  return await API.post(url, payload, config);
};

const getUserInfo = async ({ accessToken, userId }) => {
  const url = `/user/${userId}`;
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  return API.get(url, config);
};

export const authServices = {
  logInUser,
  refreshAccessToken,
  getUserInfo,
};
