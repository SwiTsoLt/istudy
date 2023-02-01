import React from "react";
import { Link } from "react-router-dom";
import "./home.scss"

export function Home() {
  return (
    <div className="home">
      <nav>
        <ul className="links">
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
