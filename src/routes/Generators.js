import React, { useCallback, useEffect, useState } from 'react';

import { generateShuffledArray } from '../utilities.js';
import { getItem, getTotal } from '../api.js';

import Album from '../Album.js';

function generateRoute({ type }) {
  return function ({ token }) {
    // We store the total number of albums/playlists, and an array of indices
    // which are shuffled.
    let [{ total, array }, setObject] = useState({ total: 0, array: [] });
    let [item, setItem] = useState({ name: '', image_url: '', image_width: '', spotify_url: '' });
    let [errorDescription, setErrorDescription] = useState('');

    const loading = total === 0;

    // Simple error handler: display errors when they occur.
    const handleError = (err) => {
      console.error(err);
      setErrorDescription(err.message);
    };

    // Shuffle the array based on the total number of items.
    const shuffleArray = useCallback((total) => {
      const array = generateShuffledArray(total);
      setObject({ total, array });
    }, []);

    // Set the current item to the next item on the array.
    const getNextItem = () => {
      array = array.slice(1);
      if (array.length === 0) {
        shuffleArray(total);
      } else {
        setObject({ total, array });
      }
    };

    // On mount, update total number of albums.
    useEffect(() => {
      getTotal({ type, token })
        .then(shuffleArray)
        .catch(handleError);
    }, [token, shuffleArray]);

    // Set the current item based on the latest index from the array.
    // Note: this loads each item only when shown.
    // TODO: optimize to load the next few items.
    useEffect(() => {
      if (array.length === 0) {
        return;
      }

      const index = array[0];

      getItem({ index, token, type })
        .then(setItem)
        .catch(handleError);
    }, [array, token]);

    return (
      <main>
        <Album {...item} />
        {!loading && (
          <p>
            <button onClick={getNextItem}>Get another {type}</button>
            <button onClick={() => shuffleArray(total)}>Re-shuffle {type}s</button>
          </p>
        )}
        {errorDescription && (
          <p>
            An error has occurred: <br />
            {errorDescription}
          </p>
        )}
      </main>
    );
  };
}

export const AlbumRoute = generateRoute({ type: 'album' });

export const PlaylistRoute = generateRoute({ type: 'playlist' });
