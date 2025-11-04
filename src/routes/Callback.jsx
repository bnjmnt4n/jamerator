import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

import AuthenticationContext from "../AuthenticationContext.jsx";
import { getToken } from "../auth.js";

export default function CallbackRoute() {
  const { setToken } = useContext(AuthenticationContext);

  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const code = urlParams.get("code");
  const error = urlParams.get("error");

  if (error || !code) {
    return (
      <main style={{ textAlign: "center" }}>
        <h2>Error Signing In</h2>
        {error && <p>Error: {error}</p>}
        <p>Please try again:</p>
        <p>
          <button
            className="spotify"
            onClick={async () => {
              window.location.href = await generateAuthorizationUrl();
            }}
          >
            Sign in with Spotify
          </button>
        </p>
      </main>
    );
  }

  useEffect(() => {
    (async () => {
      const response = await getToken(code);
      setToken(response.access_token);
      navigate("/", { replace: true });
    })();
  }, []);

  return (
    <main style={{ textAlign: "center" }}>
      <p>Loading...</p>
    </main>
  );
}
