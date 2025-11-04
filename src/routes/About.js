import styles from "./About.module.css";

export default function AboutRoute() {
  return (
    <main className={styles.about}>
      <h2 id="about">About</h2>

      <p>
        Do you have a really large music library? If you’re anything like me,
        sometimes you just want to load up a random album or playlist without
        having to think about it. Spotify allows you to shuffle from all your
        liked songs, but getting a random album is currently unfeasible.
        Hopefully, this simple webapp allows you to rediscover albums you’ve
        added but long forgotten about.
      </p>

      <p>
        jamerator is a project by <a href="https://ofcr.se/">Benjamin Tan</a>.
        Source code is available on{" "}
        <a href="https://github.com/bnjmnt4n/jamerator">GitHub</a>, under the{" "}
        <a href="https://github.com/bnjmnt4n/jamerator/blob/master/LICENSE-MIT.txt">
          MIT License
        </a>
        .
      </p>
    </main>
  );
}
