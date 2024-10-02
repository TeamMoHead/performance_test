import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import {
  GameContextProvider,
  OpenViduContextProvider,
  MediaPipeContextProvider,
} from './contexts';

import Main from './Main';
import MediaPipeTest from './pages/MediaPipeTest/MediaPipeTest';
import {
  WebWorkerTest,
  WorkerOnPage,
  WorkerOffPage,
} from './pages/WebWorkerTest';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/main" element={<Main />} />
        <Route
          path="/mediapipe-test"
          element={
            <GameContextProvider>
              <OpenViduContextProvider>
                <MediaPipeContextProvider>
                  <MediaPipeTest />
                </MediaPipeContextProvider>
              </OpenViduContextProvider>
            </GameContextProvider>
          }
        />
        <Route path="/worker-test" element={<WebWorkerTest />} />
        <Route path="/worker-on" element={<WorkerOnPage />} />
        <Route path="/worker-off" element={<WorkerOffPage />} />

        <Route path="*" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}
export default Router;
