import React, { createContext, useEffect, useState } from 'react';

import { DataStore } from './utilities';
import { validateToken } from './api.js';

const AuthenticationContext = createContext();

function AuthenticationProvider({ children }) {
  const [token, setToken] = useState(DataStore.get('token', ''));
  const [authenticationState, setAuthenticationState] = useState('');

  // For each change in token, ...
  useEffect(() => {
    // validate token and...
    if (token) {
      setAuthenticationState('authenticating');
      validateToken(token).then((isValid) => {
        if (!isValid) {
          setToken('');
          setAuthenticationState('');
        } else {
          setAuthenticationState('authenticated');
        }
      });
    }

    // ...store token locally.
    DataStore.set('token', token);
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
