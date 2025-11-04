import React from 'react';
import { Link } from 'react-router';

import * as CONFIG from './config.js';

import styles from './Header.module.css';

import logo from './logo.svg';

export default function Header({ compact }) {
  return (
    <header>
      <Link to="/" className={styles.link}>
        <h1 className={styles.heading}>
          <img src={logo} className={styles.logo} alt="Shuffle logo" width="30" height="30" />
          {CONFIG.APP_NAME}
        </h1>
      </Link>

      {!compact && <span>{CONFIG.APP_DESCRIPTION}</span>}
    </header>
  );
}
