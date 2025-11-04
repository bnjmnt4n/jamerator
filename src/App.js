import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './App.css';

import { AuthenticationProvider } from './AuthenticationContext.js';
import PrivateRoute from './routes/Private.js';
import IndexRoute from './routes/Main.js';
import AboutRoute from './routes/About.js';
import CallbackRoute from './routes/Callback.js';
import { AlbumRoute, PlaylistRoute } from './routes/Generators.js';

import Header from './Header.js';
import Footer from './Footer.js';

export default function App() {
  return (
    <AuthenticationProvider>
      <BrowserRouter>
        <div className="App">
          <Header compact="false" />

          <Routes>
            <Route path="/" element={<IndexRoute />} />
            <Route path="about" element={<AboutRoute />} />
            <Route path="callback" element={<CallbackRoute />} />
            <Route path="album" element={<PrivateRoute element={<AlbumRoute />} />} />
            <Route path="playlist" element={<PrivateRoute element={<PlaylistRoute />} />} />

            {/* Redirect to home page on 404. */}
            <Route
              path="*"
              element={<Navigate to="/" />}
            />
          </Routes>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthenticationProvider>
  );
}
