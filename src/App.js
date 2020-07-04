import React, { useEffect, useState } from 'react';
import { Redirect, BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { DataStore } from './utilities';
import { validateToken } from './api.js';

import './App.css';

import PrivateRoute from './routes/Private.js';
import IndexRoute from './routes/Main.js';
import AboutRoute from './routes/About.js';
import CallbackRoute from './routes/Callback.js';
import { AlbumRoute, PlaylistRoute } from './routes/Generators.js';
import RecentlyPlayedRoute from './routes/Recent.js';

import Header from './Header.js';
import Footer from './Footer.js';

export default function App() {
  let [token, setToken] = useState(DataStore.get('token', ''));
  let [authState, setAuthState] = useState('');

  // For each change in token, ...
  useEffect(() => {
    // validate token and...
    if (token) {
      setAuthState('authenticating');
      validateToken(token).then((isValid) => {
        if (!isValid) {
          setToken('');
          setAuthState('');
        } else {
          setAuthState('authenticated');
        }
      });
    }

    // ...store token locally.
    DataStore.set('token', token);
  }, [token]);

  return (
    <Router>
      <div className="App">
        <Header compact="false" />

        <Switch>
          <Route
            path="/"
            exact
            render={() => <IndexRoute token={token} />}
          />
          <Route
            path="/callback/"
            render={({ location }) => <CallbackRoute setToken={setToken} location={location} />}
          />
          <Route
            path="/about/"
            component={AboutRoute}
          />
          <PrivateRoute
            path="/recent/"
            authenticationState={authState}
            render={(props) => <RecentlyPlayedRoute {...props} token={token} />}
          />
          <PrivateRoute
            path="/album/"
            authenticationState={authState}
            render={(props) => <AlbumRoute {...props} token={token} />}
          />
          <PrivateRoute
            path="/playlist/"
            authenticationState={authState}
            render={(props) => <PlaylistRoute {...props} token={token} />}
          />

          {/* Redirect to home page on 404. */}
          <Route
            render={() => <Redirect to={{ pathname: "/" }} />}
          />
        </Switch>

        <Footer />
      </div>
    </Router>
  );
}
