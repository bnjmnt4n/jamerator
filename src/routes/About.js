import React from 'react';

import styles from './About.module.css';

export default function AboutRoute() {
  return (
    <main className={styles.about}>
      <h2 id="about">About</h2>

      <section>
        <h3 id="motivation">Motivation</h3>
        <p>
          Do you have a really large music library? If you’re anything like me, sometimes you just want to load up a random album or playlist without having to go through the process of figuring out the best album to listen to. Spotify does allow you to shuffle from all your liked songs, but getting a random album is currently unfeasible. Hopefully, this simple webapp allows you to rediscover hidden gems which you’ve added, but long forgotten about.
        </p>
      </section>

      <section>
        <h3 id="colophon">Colophon</h3>
        <p>
          jamerator was built with modern web technologes including <a href="https://reactjs.org/">React</a> and <a href="https://reacttraining.com/react-router/">React Router</a>. It utilizes the <a href="https://developer.spotify.com/documentation/web-api/">Spotify Web API</a> to obtain the list of saved albums/playlists in a user’s library, and shuffles the list using the <a href="https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle">Fisher-Yates algorithm</a> to provide a random one.
        </p>
      </section>
    </main>
  );
}
