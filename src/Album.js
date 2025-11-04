import { useState } from "react";

import { DEFAULT_IMAGE_DIMENSION } from "./config.js";
import { readableTime } from "./utilities.js";

import { fetchWithToken, putWithToken, fetchDevice } from "./api.js";

export default function Album({
  type,
  token,
  name,
  artist,
  uri,
  image_url,
  spotify_url,
  total_tracks,
  total_time,
  track_uris,
}) {
  const tracks = typeof total_tracks == "number" ? total_tracks : "";
  const time = typeof total_time == "number" ? readableTime(total_time) : "";

  const [status, setStatus] = useState("initial");
  const [playStatus, setPlayStatus] = useState("initial");

  async function play() {
    setPlayStatus("playing");
    const device = await fetchDevice({ token });
    const playUrl = new URL(`https://api.spotify.com/v1/me/player/play`);
    if (device) {
      playUrl.searchParams.append("device_id", device.id);
    }
    await putWithToken(playUrl, { context_uri: uri }, token);
    setPlayStatus("done");
  }
  async function queue() {
    setStatus("queueing");
    const device = await fetchDevice({ token });
    for (const track_uri of track_uris) {
      const queueUrl = new URL(`https://api.spotify.com/v1/me/player/queue`);
      queueUrl.searchParams.append("uri", track_uri);
      if (device) {
        queueUrl.searchParams.append("device_id", device.id);
      }
      await fetchWithToken(queueUrl, token, true);
    }
    setStatus("done");
  }

  return (
    <tr>
      <td className="image">
        <a className="button" href={spotify_url}>
          <img
            src={image_url}
            width={DEFAULT_IMAGE_DIMENSION}
            height={DEFAULT_IMAGE_DIMENSION}
            alt={
              type === "album"
                ? `Album cover for ${name} by ${artist}`
                : `Cover for playlist ${name}`
            }
          />
        </a>
      </td>

      <td className="album">
        <a className="button" href={spotify_url}>
          <strong>{name}</strong>
          <br />
          {artist}
        </a>
      </td>

      <td className="tracks">{tracks}</td>

      {type === "album" && <td className="runtime">{time}</td>}

      <td className="buttons">
        <button onClick={play} disabled={playStatus === "playing"}>
          {playStatus === "initial"
            ? "Play"
            : playStatus === "playing"
              ? "Playing"
              : "Play"}
        </button>
        <br />
        {type === "album" && (
          <button onClick={queue} disabled={status === "queueing"}>
            {status === "initial"
              ? "Queue"
              : status === "queueing"
                ? "Queueing"
                : "Queued"}
          </button>
        )}
      </td>
    </tr>
  );
}
