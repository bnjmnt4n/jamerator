import React, { createContext, useEffect, useState } from 'react';

import { DataStore } from './utilities';
import { validateToken } from './api.js';

const AuthenticationContext = createContext();

function AuthenticationProvider({ children }) {
  const [token, setToken] = useState(DataStore.get('token', ''));
  const [authenticationState, setAuthenticationState] = useState('');

  // For each change in token, ...
  useEffect(async () => {
    // ...store token locally and...
      DataStore.set('token', token);

    // validate token and.
    if (token) {
      setAuthenticationState('authenticating');
      const isValid = await validateToken(token);
      if (!isValid) {
        setToken('');
        setAuthenticationState('');
      } else {
        setAuthenticationState('authenticated');
      }
    }
  }, [token]);

  return (
    <AuthenticationContext.Provider
      value={{
        authenticationState,
        token,
        setToken
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export default AuthenticationContext;

export { AuthenticationProvider };
