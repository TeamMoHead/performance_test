import axios from 'axios';
import { CONFIGS } from '../config.js';

const API = axios.create({
  baseURL: CONFIGS.BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getConnectionToken = async ({ accessToken, userData }) => {
  const url = '/start-session';

  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  return API.post(url, { userData }, config);
};

export const authServices = {
  getConnectionToken,
};
