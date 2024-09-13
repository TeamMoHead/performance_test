import React, { useContext, useEffect, useState } from 'react';
import { AccountContext, UserContext, OpenViduContext } from './contexts';
import TestPage from './pages/TestPage';
import styled from 'styled-components';
import * as S from './styles/common';

function App() {
  const { userId } = useContext(AccountContext);
  const { myData } = useContext(UserContext);
  const { videoSession, myStream, mateStreams, setStartVideo } =
    useContext(OpenViduContext);
  const [showTestPage, setShowTestPage] = useState(false);

  const stopTest = () => {
    if (videoSession) {
      videoSession.off('streamCreated');
      videoSession.disconnect();
    }
    // if (myStream) {
    //   myStream.dispose();
    //   mateStreams.forEach(stream => stream.dispose());
    // }
    setStartVideo(false);
    setShowTestPage(false);
  };

  return (
    <S.PageWrapper>
      {showTestPage ? (
        <>
          <S.Button
            onClick={() => stopTest()}
            style={{ backgroundColor: 'red' }}
          >
            stop-test
          </S.Button>
          <TestPage />
        </>
      ) : userId ? (
        <>
          <S.Head>
            {'< '}Home{' >'}
          </S.Head>
          <Data>User ID:: {myData?.userId}</Data>
          <Data>User Name:: {myData?.userName}</Data>
          <Data>Challenge ID:: {myData?.challengeId}</Data>

          <S.Button
            onClick={() => setShowTestPage(true)}
            style={{ backgroundColor: 'green' }}
          >
            start-test
          </S.Button>
        </>
      ) : (
        <span>로딩중...</span>
      )}
    </S.PageWrapper>
  );
}

export default App;

const Data = styled.p`
  font-size: 15px;
`;
