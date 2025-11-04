import { useContext } from "react";
import { Link } from "react-router";

import AuthenticationContext from "../AuthenticationContext.jsx";

import { Main } from "../Main.jsx";
import { generateAuthorizationUrl } from "../auth.js";

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
            <button
              className="spotify"
              onClick={async () => {
                window.location.href = await generateAuthorizationUrl();
              }}
            >
              Sign In with Spotify
            </button>
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
