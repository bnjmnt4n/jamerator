import * as CONFIG from "./config.js";

const API_URLS = {
  album: ({ offset }) =>
    `https://api.spotify.com/v1/me/albums?offset=${offset}&limit=1`,
  playlist: ({ offset }) =>
    `https://api.spotify.com/v1/me/playlists?offset=${offset}&limit=1`,
};

// Send a request to the specified URL with the bearer token and obtain the response as JSON.
export async function fetchWithToken(url, token, isPost) {
  const response = await fetch(url, {
    ...(isPost ? { method: "POST" } : {}),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (isPost) {
    return await response.text();
  }
  const json = await response.json();

  if (json.error) {
    let err;
    if (typeof json.error === "object") {
      err = new Error(`${json.error.status} ${json.error.message}`);
    } else {
      err = new Error(json.error_description);
    }
    err.object = json;
    throw err;
  }

  return json;
}

export async function putWithToken(url, body, token) {
  const response = await fetch(url, {
    body: JSON.stringify(body),
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.text();
}

// Validate a token by sending a request to access a saved album.
// This is only allowed if the token is still valid and has the correct access rights.
export async function validateToken(token) {
  try {
    // We use `getItem` instead of `getItemInternal` to ensure that all required
    // data fields are accessible.
    await getItem({ token, type: "album", index: 0 });
    return true;
  } catch (e) {
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

  item = options.type === "album" ? item.album : item;

  return await extractItemDetails(item, options.token);
}

// Obtain the raw data for a specific saved album/playlist.
function getItemInternal({ index, token, type }) {
  const api_url = API_URLS[type]({ offset: index });

  return fetchWithToken(api_url, token);
}

// Get selected details of a specific album or playlist.
async function extractItemDetails(item, token) {
  const {
    name,
    uri,
    external_urls: { spotify: spotify_url },
  } = item;
  const artist_details = extractArtistDetails(item);
  const image_details = extractImageDetails(item);
  const track_details = await extractTrackDetails(item, token);

  return {
    name,
    uri,
    spotify_url,
    ...artist_details,
    ...image_details,
    ...track_details,
  };
}

// Get the artist of a specific album.
function extractArtistDetails({ type, artists }) {
  if (type === "album") {
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
      .filter((image) => image.width >= CONFIG.DEFAULT_IMAGE_DIMENSION)
      .reverse()[0] || images[0];

  return {
    image_url,
    image_width,
    image_height,
  };
}

// Get the number of tracks and runtime of an album or playlist.
async function extractTrackDetails({ total_tracks, tracks }, token) {
  // Playlists have a different API.
  if (!total_tracks) {
    return {
      total_tracks: tracks.total,
    };
  }

  let total_ms = 0;
  const track_uris = [];

  do {
    for (const item of tracks.items) {
      total_ms += item.duration_ms;
      track_uris.push(item.uri);
    }
    if (tracks.next) tracks = await fetchWithToken(tracks.next, token);
    else tracks = null;
  } while (tracks);

  const total_time = Math.round(total_ms);

  return {
    total_tracks,
    total_time,
    track_uris,
  };
}

export async function fetchDevice({ token }) {
  const response = await fetchWithToken(
    `https://api.spotify.com/v1/me/player/devices`,
    token,
  );
  const availableDevices = response.devices.filter(
    (device) => !device.is_restricted,
  );
  const device =
    availableDevices.find((device) => device.is_active) || availableDevices[0];

  return device;
}
