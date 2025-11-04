import pkg from "../package.json";

export const APP_NAME = pkg.name;

export const APP_DESCRIPTION = pkg.description;

export const DEFAULT_IMAGE_DIMENSION = 300;

export const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT;

export const SCOPES =
  "user-library-read playlist-read-private playlist-read-collaborative";
