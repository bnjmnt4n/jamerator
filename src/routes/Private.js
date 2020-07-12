import React, { useContext } from 'react';
import { Route } from 'react-router-dom';

import AuthenticationContext from '../AuthenticationContext.js';
import { getLoginURL } from '../api.js';

export default function PrivateRoute({
  component: Component,
  render: renderRoute,
  ...rest
}) {
  const { authenticationState } = useContext(AuthenticationContext);

  // Internal render function, handling authentication requests.
  const internalRender = (props) => {
    switch (authenticationState) {
      case 'authenticated':
        if (Component) {
          // Currently, route components do not require any props.
          return <Component />;
        }
        return renderRoute(props);
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
