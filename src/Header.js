import React from 'react';
import { Link } from 'react-router-dom';

import * as CONFIG from './config.js';

import styles from './Header.module.css';

export default function Header({ compact }) {
  return (
    <header>
      <Link to="/" className={styles.heading}>
        {/* <img src={logo} className="App-logo" alt="logo" width="200" height="200" /> */}
        <h1>{CONFIG.APP_NAME}</h1>
      </Link>

      {!compact && <span>{CONFIG.APP_DESCRIPTION}</span>}
    </header>
  );
}
