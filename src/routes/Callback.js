import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import queryString from "query-string";

import AuthenticationContext from "../AuthenticationContext.js";
import { getLoginURL } from "../api.js";

export default function CallbackRoute() {
  const { setToken } = useContext(AuthenticationContext);

  const location = useLocation();
  const { search, hash } = location;
  const { redirect } = queryString.parse(search);
  const { error, access_token } = queryString.parse(hash);

  if (error || !access_token) {
    return (
      <main>
        <h2>Error Signing Into Spotify</h2>
        {error && <p>{error}</p>}
        <p>Try signing in again:</p>
        <p>
          <a className="button" href={getLoginURL()}>
            Sign in with Spotify
          </a>
        </p>
      </main>
    );
  }

  setToken(access_token);

  return <Navigate to={`/${redirect || ""}`} replace />;
}
