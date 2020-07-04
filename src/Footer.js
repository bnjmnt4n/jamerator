import React from 'react';

import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        © 2018–2020 by <a href="https://ofcr.se/">Benjamin Tan</a><br />
        Licensed under the <a href="https://github.com/bnjmnt4n/jamerator/blob/master/LICENSE-MIT.txt">MIT License</a>
      </p>
    </footer>
  );
}
