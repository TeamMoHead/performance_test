import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountContext, UserContext } from './contexts';
import styled from 'styled-components';
import * as S from './styles/common';

function Main() {
  const navigate = useNavigate();
  const { userId } = useContext(AccountContext);
  const { myData } = useContext(UserContext);

  const moveToMediapipeTest = () => {
    navigate('/mediapipe-test');
  };

  const moveToWorkerTest = () => {
    navigate('/worker-test');
  };

  return (
    <S.PageWrapper>
      {userId ? (
        <>
          <S.Head>
            {'< '}Main{' >'}
          </S.Head>
          <Data>User ID:: {myData?.userId}</Data>
          <Data>User Name:: {myData?.userName}</Data>
          <Data>Challenge ID:: {myData?.challengeId}</Data>

          <S.Button
            onClick={() => moveToMediapipeTest()}
            style={{ backgroundColor: 'green' }}
          >
            mediaPipe-test
          </S.Button>
          <S.Button
            onClick={() => moveToWorkerTest()}
            style={{ backgroundColor: 'orange' }}
          >
            worker-test
          </S.Button>
        </>
      ) : (
        <span>로딩중...</span>
      )}
    </S.PageWrapper>
  );
}

export default Main;

const Data = styled.p`
  font-size: 15px;
`;
