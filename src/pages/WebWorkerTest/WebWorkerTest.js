import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import * as S from '../../styles/common';

const WebWorkerTest = () => {
  const navigate = useNavigate();

  const moveToWorkerOnPage = () => {
    navigate('/worker-on');
  };

  const moveToWorkerOffPage = () => {
    navigate('/worker-off');
  };

  const moveToMain = () => {
    navigate('/main');
  };

  return (
    <S.PageWrapper>
      <S.Head>
        {'< '}WebWorkerTest{' >'}
      </S.Head>
      <S.Button
        onClick={() => moveToWorkerOnPage()}
        style={{ backgroundColor: 'skyblue' }}
      >
        worker-on
      </S.Button>
      <S.Button
        onClick={() => moveToWorkerOffPage()}
        style={{ backgroundColor: 'pink' }}
      >
        worker-off
      </S.Button>
      <S.Button
        onClick={() => moveToMain()}
        style={{ backgroundColor: 'yellow' }}
      >
        go-to-main
      </S.Button>
      <Outlet />
    </S.PageWrapper>
  );
};

export default WebWorkerTest;
