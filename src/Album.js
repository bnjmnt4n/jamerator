import React from "react";

import { DEFAULT_IMAGE_DIMENSION } from "./config.js";
import { pluralize, readableTime } from "./utilities.js";

import styles from "./Album.module.css";

export default function Album({
  name,
  artist,
  image_url,
  image_width,
  spotify_url,
  total_tracks,
  total_time,
}) {
  let loading = !spotify_url;
  if (loading) {
    name = "Loading...";
    image_width = DEFAULT_IMAGE_DIMENSION;
    image_url = "";
  }

  if (image_width > DEFAULT_IMAGE_DIMENSION) {
    image_width = DEFAULT_IMAGE_DIMENSION;
  }

  const tracks =
    typeof total_tracks == "number" ? pluralize(total_tracks, "track") : "";
  const time = typeof total_time == "number" ? readableTime(total_time) : "";

  return (
    <article className="Album">
      <img
        className={styles.AlbumImage}
        src={image_url}
        width={image_width}
        alt={loading ? name : `“${name} by ${artist}” Album Cover`}
      />

      <h1>{name}</h1>
      <h2>{artist}</h2>

      <p>
        {tracks}
        {tracks && time && <br />}
        {time}
      </p>

      {!loading && (
        <p>
          <a className="button" href={spotify_url}>
            Open with Spotify
          </a>
        </p>
      )}
    </article>
  );
}
