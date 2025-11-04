import { Link } from "react-router";

import * as CONFIG from "./config.js";

import styles from "./Header.module.css";

import logo from "./logo.svg";

export default function Header() {
  return (
    <header>
      <Link to="/" className={styles.link}>
        <h1 className={styles.heading}>
          <img src={logo} alt="" width="30" height="30" />
          {CONFIG.APP_NAME}
        </h1>
      </Link>
    </header>
  );
}
