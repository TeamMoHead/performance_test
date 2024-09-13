import React, { useState, createContext, useContext, useEffect } from 'react';
import { AccountContext } from './AccountContext';
import useFetch from '../hooks/useFetch';
import { authServices } from '../apis/authServices';
import { inGameServices } from '../apis/inGameServices';

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const { fetchData } = useFetch();
  const { accessToken, userId } = useContext(AccountContext);
  const [myData, setMyData] = useState({
    // userId: 1,
    // userName: '',
    // challengeId: 0,
  });
  const [challengeId, setChallengeId] = useState(null);
  const [challengeData, setChallengeData] = useState({
    // challengeId: 6,
    // startDate: '2021-09-01T00:00:00.000Z',
    // wakeTime: '17:30',
    // duration: 7,
    // mates: [
    //   { userId: 1, userName: '천사박경원' },
    //   { userId: 2, userName: '귀요미이시현' },
    //   { userId: 3, userName: '깜찍이이재원' },
    //   { userId: 4, userName: '상큼이금도현' },
    //   { userId: 5, userName: '똑똑이연선애' },
    // ],
  });

  const getMyData = async () => {
    const response = await fetchData(() =>
      authServices.getUserInfo({ accessToken, userId }),
    );

    const { isLoading, data, error } = response;

    if (!isLoading && data) {
      setMyData(data);
      setChallengeId(data.challengeId);
    } else {
      console.error(error);
    }

    return response;
  };

  const getChallengeData = async () => {
    const response = await fetchData(() =>
      inGameServices.getChallengeInfo({
        accessToken,
        challengeId: challengeId,
      }),
    );

    const {
      isLoading: isChallengeDataLoading,
      data: userChallengeData,
      error: challengeDataError,
    } = response;

    if (!isChallengeDataLoading && userChallengeData) {
      setChallengeData(userChallengeData);
    } else if (!isChallengeDataLoading && challengeDataError) {
      console.error(challengeDataError);
    }
  };

  useEffect(() => {
    if (accessToken && userId) {
      getMyData();
    }
  }, [userId]);

  useEffect(() => {
    if (challengeId) {
      getChallengeData();
    }
  }, [challengeId]);

  return (
    <UserContext.Provider
      value={{
        myData,
        setMyData,
        challengeId,
        setChallengeId,
        getMyData,
        challengeData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
