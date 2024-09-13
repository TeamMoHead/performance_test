import React, { createContext, useState, useEffect } from 'react';
import { authServices } from '../apis/authServices';
import useFetch from '../hooks/useFetch';

const AccountContext = createContext();

const AccountContextProvider = ({ children }) => {
  const { fetchData } = useFetch();

  const [accessToken, setAccessToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const logIn = async () => {
    const response = await fetchData(() => authServices.logInUser());

    const { isLoading, data, error } = response;

    if (!isLoading && data) {
      setAccessToken(data.accessToken);
      setUserId(data.userId);
    } else {
      console.error(error);
    }

    return response;
  };

  const logOut = async () => {
    try {
      const response = await authServices.logOutUser({
        accessToken,
        userId,
      });
      if (response.status === 200) {
        setAccessToken(null);
        localStorage.removeItem('refreshToken');
        return true;
      }
    } catch (error) {
      console.error('Logout failed', error);
      return false;
    }
  };

  useEffect(() => {
    if (!userId) {
      logIn();
    }
  }, []);

  return (
    <AccountContext.Provider
      value={{
        setAccessToken,
        accessToken,
        setUserId,
        userId,
        logOut,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export { AccountContext, AccountContextProvider };
