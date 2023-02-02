import React from "react";
import { Link } from "react-router-dom";
import styles from "./home.module.css";

export function Home() {
  return (
    <div className={styles.home}>
      <nav>
        <ul className={styles.links}>
          <li>
            <Link to="/display">Display</Link>
          </li>
          <li>
            <Link to="/controller">Controller</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
