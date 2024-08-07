import React, { useContext, useEffect, useState } from 'react';
import { AccountContext } from './contexts/AccountContext';
import { UserContext } from './contexts/UserContext';
import styled from 'styled-components';

function App() {
  const { userId } = useContext(AccountContext);
  const { myData } = useContext(UserContext);

  return (
    <PageWrapper>
      <Head>
        {'< '}Home{' >'}
      </Head>
      {userId ? (
        <>
          <Data>User ID: {myData?.userId}</Data>
          <Data>User Name: {myData?.userName}</Data>
          <Data>Challenge ID: {myData?.challengeId}</Data>
        </>
      ) : (
        <span>로딩중...</span>
      )}
      <Button>Start Test</Button>
    </PageWrapper>
  );
}

export default App;

const PageWrapper = styled.div`
  ${({ theme }) => theme.flex.center}
  flex-direction: column;
  gap: 20px;

  width: calc(100vw-'48px');

  margin: 100px 24px 50px 24px;
`;

const Head = styled.h1`
  font-size: 30px;
  font-weight: 900;
  margin: 40px;
  color: skyblue;
`;

const Data = styled.p`
  font-size: 20px;
`;

const Button = styled.button`
  width: 200px;
  padding: 10px 20px;
  margin: 20px;
  border-radius: ${({ theme }) => theme.radius.small};

  background-color: orange;
  color: black;

  cursor: pointer;
`;
