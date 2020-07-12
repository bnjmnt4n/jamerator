import React from 'react';
import { Route } from 'react-router-dom';

import { getLoginURL } from '../api.js';

export default function PrivateRoute({ render, authenticationState, ...rest }) {
  const internalRender = (props) => {
    switch (authenticationState) {
      case 'authenticated':
        return render(props);
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
                href={getLoginURL(props.location.pathname.slice(1))}
              >
                Sign in with Spotify
              </a>
            </p>
          </main>
        );
    }
  };

  return <Route {...rest} render={internalRender} />;
}
