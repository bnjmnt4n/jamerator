# jamerator

A random album/playlist selector for Spotify. [View the deployed version.](https://jamerator.ofcr.se/)

## Usage

1. Create a [Spotify app](https://developer.spotify.com/dashboard) and obtain a Spotify Client ID.

1. Add the following redirect URI. If you're going to deploy the app, do add URIs for your app’s domain as well.

   ```
   http://127.0.0.1:5173/callback
   ```

1. Install dependencies:

   ```sh
   npm i
   ```

1. Add the Spotify client ID to `.env.local`:

   ```
   VITE_SPOTIFY_CLIENT_ID="<CLIENT_ID>"
   ```

1. Start up a dev server using:

   ```sh
   npm start
   ```

1. For deployments, build a static version using:

   ```sh
   npm build
   ```
