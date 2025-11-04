import { useCallback, useContext, useEffect, useState } from "react";
import { useQueries } from "@tanstack/react-query";

import AuthenticationContext from "./AuthenticationContext.jsx";
import { generateShuffledArray } from "./utilities.js";
import { getItem, getTotal, fetchWithToken, fetchDevice } from "./api.js";

import Album from "./Album.jsx";

const ITEMS_TO_DISPLAY = 4;

export function Main() {
  const [type, setType] = useState(() => {
    const item = localStorage.getItem("last_page");
    return item === "album" || item === "playlist" ? item : "album";
  });
  const { token } = useContext(AuthenticationContext);

  // We store the total number of albums/playlists, and an array of indices
  // which are shuffled.
  let [{ total, display, array }, setObject] = useState({
    total: 0,
    display: [],
    array: [],
  });
  let [errorDescription, setErrorDescription] = useState("");

  const combinedQueries = useQueries({
    queries: display.map((index) => ({
      queryKey: [type, index],
      queryFn: () => getItem({ index, token, type }),
    })),
    combine: (results) => {
      if (results.some((result) => result.isError))
        return {
          state: "error",
          error: results.find((result) => result.isError).error,
        };

      if (results.some((result) => result.isPending))
        return {
          state: "pending",
        };

      return {
        state: "done",
        data: results.map((result) => result.data),
      };
    },
  });

  const loading = total === 0 || combinedQueries.state === "pending";

  // Simple error handler: display errors when they occur.
  function handleError(err) {
    console.error(err);
    setErrorDescription(err.message);
  }

  // Shuffle the array based on the total number of items.
  const shuffleArray = useCallback((total) => {
    const array = generateShuffledArray(total);
    const display = array.slice(0, ITEMS_TO_DISPLAY);
    const remainder = array.slice(ITEMS_TO_DISPLAY);
    setObject({ total, display, array: remainder });
  }, []);

  // On mount, update total number of albums.
  useEffect(() => {
    getTotal({ type, token }).then(shuffleArray).catch(handleError);
  }, [token, shuffleArray, type]);

  function getNextPage() {
    const display = array.slice(0, ITEMS_TO_DISPLAY);
    const remainder = array.slice(ITEMS_TO_DISPLAY);
    if (array.length === 0) {
      shuffleArray(total);
    } else {
      setObject({ total, display, array: remainder });
    }
  }

  async function queue() {
    const device = await fetchDevice({ token });
    for (const items of combinedQueries.data ?? []) {
      for (const track_uri of items.track_uris) {
        const queueUrl = new URL(`https://api.spotify.com/v1/me/player/queue`);
        queueUrl.searchParams.append("uri", track_uri);
        if (device) {
          queueUrl.searchParams.append("device_id", device.id);
        }
        await fetchWithToken(queueUrl, token, true);
      }
    }
  }

  return (
    <main style={{ width: 800 }}>
      <fieldset>
        {["album", "playlist"].map((localType) => (
          <div key={localType}>
            <input
              type="radio"
              id={localType}
              name="type"
              value={localType}
              checked={localType === type}
              onChange={() => {
                setType(localType);
                localStorage.setItem("last_page", localType);
              }}
            />
            <label htmlFor={localType}>
              {localType.charAt(0).toUpperCase() + localType.slice(1)}
            </label>
          </div>
        ))}
      </fieldset>

      <table>
        <thead>
          <tr>
            <td className="image"></td>
            <td className="album">{type === "album" ? "Album" : "Playlist"}</td>
            <td className="tracks">Tracks</td>
            {type === "album" && <td className="runtime">Runtime</td>}
            <td className="buttons">
              {type === "album" && !loading && (
                <button onClick={queue}>Queue all</button>
              )}
            </td>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr key="loading" className="loading">
              <td colSpan={type === "album" ? 5 : 4}>Loading...</td>
            </tr>
          ) : (
            combinedQueries.data?.map((item) => (
              <Album
                key={item.id}
                id={item.id}
                type={type}
                token={token}
                {...item}
              />
            ))
          )}
        </tbody>
      </table>
      {!loading && (
        <p>
          <button onClick={getNextPage}>Get next page</button>
          <button onClick={() => shuffleArray(total)}>Re-shuffle</button>
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
}
