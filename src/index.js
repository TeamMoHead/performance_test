import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import {
  AccountContextProvider,
  UserContextProvider,
  GameContextProvider,
  OpenViduContextProvider,
  MediaPipeContextProvider,
} from './contexts';

import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';
import { ThemeProvider } from 'styled-components';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <>
    <GlobalStyle />
    <ThemeProvider theme={theme}>
      <AccountContextProvider>
        <UserContextProvider>
          <GameContextProvider>
            <OpenViduContextProvider>
              <MediaPipeContextProvider>
                <App />
              </MediaPipeContextProvider>
            </OpenViduContextProvider>
          </GameContextProvider>
        </UserContextProvider>
      </AccountContextProvider>
    </ThemeProvider>
  </>,
);

serviceWorkerRegistration.register();
