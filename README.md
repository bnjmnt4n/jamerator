# jamerator

A random album/playlist selector for Spotify. [View the deployed version.](https://jamerator.ofcr.se/)

jamerator is a testing ground to use React and related technologies in a fun side project. It was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Usage

1. Create a [Spotify app](https://developer.spotify.com/dashboard) and obtain a Spotify Client ID.

1. Add the following redirect URLs. If you're going to deploy the app, do add URIs for your app’s domain as well.

    ```
    http://localhost:3000/callback
    http://localhost:3000/callback?redirect=album
    http://localhost:3000/callback?redirect=playlist
    ```

1. Install dependencies:

    ```sh
    npm i
    ```

1. Start up a dev server using:

    ```sh
    REACT_APP_SPOTIFY_CLIENT="CLIENT_ID" npm start
    ```

1. For deployments, build a static version using:

    ```sh
    REACT_APP_SPOTIFY_CLIENT="CLIENT_ID" npm build
    ```
