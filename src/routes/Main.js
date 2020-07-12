import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import AuthenticationContext from '../AuthenticationContext.js';

import { getLoginURL } from '../api.js';

export default function IndexRoute() {
  const { token } = useContext(AuthenticationContext);

  if (token) {
    return (
      <main>
        <nav>
          <ul>
            <li>
              <Link to="/recent">
                Get recently played items
              </Link>
            </li>
            <li>
              <Link to="/album">
                Get a random album
              </Link>
            </li>
            <li>
              <Link to="/playlist">
                Get a random playlist
              </Link>
            </li>
            <li>
              <Link to="/about">
                About
              </Link>
            </li>
          </ul>
        </nav>
      </main>
    );
  }

  return (
    <main>
      <nav>
        <ul>
          <li>
            <a href={getLoginURL()}>Sign In with Spotify</a><br />
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
