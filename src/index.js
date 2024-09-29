import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './Router';

import { AccountContextProvider, UserContextProvider } from './contexts';

import { initGlobalFPSFunction } from './components/MeasureFPS';

import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';
import { ThemeProvider } from 'styled-components';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';

initGlobalFPSFunction();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <>
    <GlobalStyle />
    <ThemeProvider theme={theme}>
      <AccountContextProvider>
        <UserContextProvider>
          <Router />
        </UserContextProvider>
      </AccountContextProvider>
    </ThemeProvider>
  </>,
);

serviceWorkerRegistration.register();
