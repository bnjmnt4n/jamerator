import { useContext } from "react";
import { Link } from "react-router";

import AuthenticationContext from "../AuthenticationContext.js";

import { getLoginURL } from "../api.js";
import { Main } from "../Main.js";

export default function IndexRoute() {
  const { authenticationState } = useContext(AuthenticationContext);

  if (authenticationState === "authenticated") {
    return <Main />;
  }

  if (authenticationState === "authenticating") {
    return (
      <main style={{ textAlign: "center" }}>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main style={{ textAlign: "center" }}>
      <p>A random album/playlist selector for Spotify.</p>
      <nav>
        <ul>
          <li>
            <a href={getLoginURL()} className="button spotify">
              Sign In with Spotify
            </a>
            <br />
          </li>
          <li style={{ marginTop: "10px" }}>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
