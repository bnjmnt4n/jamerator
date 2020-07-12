import React from 'react';
import { Redirect, BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';

import { AuthenticationProvider } from './AuthenticationContext.js';
import PrivateRoute from './routes/Private.js';
import IndexRoute from './routes/Main.js';
import AboutRoute from './routes/About.js';
import CallbackRoute from './routes/Callback.js';
import { AlbumRoute, PlaylistRoute } from './routes/Generators.js';
import RecentlyPlayedRoute from './routes/Recent.js';

import Header from './Header.js';
import Footer from './Footer.js';

export default function App() {
  return (
    <AuthenticationProvider>
      <Router>
        <div className="App">
          <Header compact="false" />

          <Switch>
            <Route path="/" exact component={IndexRoute} />
            <Route path="/about/" component={AboutRoute} />
            <Route
              path="/callback/"
              render={({ location }) => <CallbackRoute location={location} />}
            />
            <PrivateRoute path="/recent/" component={RecentlyPlayedRoute} />
            <PrivateRoute path="/album/" component={AlbumRoute} />
            <PrivateRoute path="/playlist/" component={PlaylistRoute} />

            {/* Redirect to home page on 404. */}
            <Route
              render={() => <Redirect to={{ pathname: "/" }} />}
            />
          </Switch>

          <Footer />
        </div>
      </Router>
    </AuthenticationProvider>
  );
}
