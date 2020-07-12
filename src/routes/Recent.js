import React, { useContext, useEffect, useState } from 'react';

import AuthenticationContext from '../AuthenticationContext.js';
import { getRecentlyPlayed } from '../api.js';

export default function RecentlyPlayedRoute() {
  const { token } = useContext(AuthenticationContext);

  let [recentlyPlayed, setRecentlyPlayed] = useState([]);
  let [errorDescription, setErrorDescription] = useState('');

  const refresh = () => {
    getRecentlyPlayed({ items: 20, limit: 50, token })
      .then((recentlyPlayed) => recentlyPlayed.length && setRecentlyPlayed(recentlyPlayed))
      .catch((err) => {
        console.error(err);
        setErrorDescription(err && err.message);    
      });
  };

  // Load data on initialization.
  useEffect(refresh, []);

  return (
    <main>
      <h2>Recently Played</h2>
      {
        !recentlyPlayed.length
          ? <p>Loading...</p>
          : <ol reversed>
              {recentlyPlayed.map(({ name, spotify_url }, i) => (
                <li key={i + spotify_url}>
                  <a href={spotify_url}>{name}</a>
                </li>
              ))}
            </ol>
      }
      <button onClick={refresh}>Refresh</button>
      <p>
        Note that Spotify only allows the 50 most recent songs played to be shown.
      </p>
      {errorDescription && (
        <p>
          An error has occurred: <br />
          {errorDescription}
        </p>
      )}
    </main>
  );
}
