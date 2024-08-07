import React, { useState, createContext, useContext, useEffect } from 'react';
import { AccountContext } from './AccountContext';
import useFetch from '../hooks/useFetch';
import { authServices } from '../apis/authServices';

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

  useEffect(() => {
    if (accessToken && userId) {
      getMyData();
    }
  }, [userId]);

  return (
    <UserContext.Provider
      value={{
        myData,
        setMyData,
        challengeId,
        setChallengeId,
        getMyData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
