import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';

import AuthenticationContext from '../AuthenticationContext.js';
import { getLoginURL } from '../api.js';

export default function PrivateRoute({ element }) {
  const { authenticationState } = useContext(AuthenticationContext);
  const location = useLocation();

  switch (authenticationState) {
    case 'authenticated':
      return element;
    case 'authenticating':
      return (
        <main>
          <p>
            Please wait, loading...
          </p>
        </main>
      );
    case '':
    default:
      return (
        <main>
          <h2>Sign Into Spotify</h2>
          <p>
            You need to sign in to access this page:
          </p>
          <p>
            <a
              className="button"
              href={getLoginURL(location.pathname.slice(1))}
            >
              Sign in with Spotify
            </a>
          </p>
        </main>
      );
  }
}
