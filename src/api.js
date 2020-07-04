import queryString from 'query-string';

import * as CONFIG from './config.js';

const login_url_query = {
  client_id: CONFIG.CLIENT_ID,
  response_type: 'token',
  scope: CONFIG.SCOPES,
  redirect_uri: (redirect) => {
    const query_string = redirect ? `?${queryString.stringify({ redirect })}` : '';
    return `${window.location.protocol}//${window.location.host}/callback${query_string}`;
  },
};

const API_URLS = {
  'album': ({ offset }) => `https://api.spotify.com/v1/me/albums?offset=${offset}&limit=1`,
  'playlist': ({ offset }) => `https://api.spotify.com/v1/me/playlists?offset=${offset}&limit=1`,
  'recently_played': ({ limit }) => `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
  'login_url': (redirect) => {
    const redirect_uri = login_url_query.redirect_uri(redirect);
    const query = {
      ...login_url_query,
      redirect_uri,
    };

    return `https://accounts.spotify.com/authorize?${queryString.stringify(query)}`;
  }
};

export const getLoginURL = API_URLS.login_url;

// Send a request to the specified URL with the bearer token and obtain the response as JSON.
async function fetchWithToken(url, token) {
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const json = await response.json();

  if (json.error) {
    let err;
    if (typeof json.error === 'object') {
      err = new Error(`${json.error.status} ${json.error.message}`);
    } else {
      err = new Error(json.error_description);
    }
    err.object = json;
    throw err;
  }

  return json;
}

// Validate a token by sending a request to access a saved album.
// This is only allowed if the token is still valid and has the correct access rights.
export async function validateToken(token) {
  try {
    // We use `getItem` instead of `getItemInternal` to ensure that all required
    // data fields are accessible.
    await getItem({ token, type: 'album', index: 0 });
    return true;
  } catch(e) {
    console.error(e);
    return false;
  }
}

// Obtain the total number of saved albums/playlists.
export async function getTotal({ token, type }) {
  const { total } = await getItemInternal({ index: 0, token, type });

  return total;
}

// Obtain a specific saved albums/playlists.
export async function getItem(options) {
  const json = await getItemInternal(options);
  let item = json.items[0];

  item = options.type === 'album' ? item.album : item;

  return extractItemDetails(item);
}

export async function getRecentlyPlayed({ items, limit, token }) {
  let api_url = API_URLS.recently_played({ limit });
  let results = [];
  const seenSet = new Set();

  while (api_url && results.length < items) {
    let json = await fetchWithToken(api_url, token);

    let list = await Promise.all(json.items.map(async function(item) {
      const type = item.context ? item.context.type : 'track';
      const spotify_url = (item.context ? item.context : item.track).external_urls.spotify;
      let name;
  
      if (seenSet.has(spotify_url)) {
        return null;
      }
      seenSet.add(spotify_url);
  
      switch (type) {
        case 'artist':
          name = item.track.artists[0].name;
          break;
        case 'album':
          name = `${item.track.album.name} by ${item.track.album.artists[0].name}`;
          break;
        case 'playlist':
          const playlist = await fetchWithToken(item.context.href, token);
          name = `${playlist.name} by ${playlist.owner.display_name}`;
          break;
        case 'track':
        default:
          name = `${item.track.name} by ${item.track.artists[0].name}`;
      }
  
      return { type, name, spotify_url };
    }));
  
    results = results.concat(list.filter(item => item));
    api_url = json.next;
  }

  return results;
}

// Obtain the raw data for a specific saved album/playlist.
function getItemInternal({ index, token, type }) {
  const api_url = API_URLS[type]({ offset: index });

  return fetchWithToken(api_url, token);
}

// Get selected details of a specific album or playlist.
function extractItemDetails(item) {
  const { name, external_urls: { spotify: spotify_url} } = item;
  const artist_details = extractArtistDetails(item);
  const image_details = extractImageDetails(item);
  const track_details = extractTrackDetails(item);

  return {
    name,
    spotify_url,
    ...artist_details,
    ...image_details,
    ...track_details
  };
}

// Get the artist of a specific album.
function extractArtistDetails({ type, artists }) {
  if (type === 'album') {
    return { artist: artists[0].name };
  }

  return {};
}

// Get the image details of a specific album or playlist.
function extractImageDetails({ images }) {
  const { url: image_url, width: image_width, height: image_height } =
    // Images are sorted from largest to smallest.
    images
      .slice()
      .filter(image => image.width >= CONFIG.DEFAULT_IMAGE_DIMENSION)
      .reverse()[0] ||
    images[0];

  return {
    image_url,
    image_width,
    image_height
  };
}

// Get the number of tracks and runtime of an album or playlist.
function extractTrackDetails({ total_tracks, tracks }) {
  // Playlists have a different API.
  if (!total_tracks) {
    return {
      total_tracks: tracks.total
    };
  }

  const total_ms = tracks.items.reduce((acc, item) => acc + item.duration_ms, 0);
  const total_time = Math.round(total_ms / (60 * 1000));

  return {
    total_tracks,
    total_time
  };
}
