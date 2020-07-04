import React from 'react';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';

import { getLoginURL } from '../api.js';

export default function CallbackRoute({ location, setToken }) {
  const { search, hash } = location;
  const { redirect } = queryString.parse(search);
  const { error, access_token } = queryString.parse(hash);

  if (error || !access_token) {
    return (
      <main>
        <h2>Error Signing Into Spotify</h2>
        {error && (
          <p>
            {error}
          </p>
        )}
        <p>
          Try signing in again:
        </p>
        <p>
          <a className="button" href={getLoginURL()}>Sign in with Spotify</a>
        </p>
      </main>
    );
  }

  setToken(access_token);

  return (
    <Redirect
      to={{ pathname: `/${redirect || ''}` }}
    />
  );
}
