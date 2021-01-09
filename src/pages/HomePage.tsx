import React from "react";
import { Link } from "react-router-dom";

export const HomePage: React.FC = () => {
  return (
    <div>
      <h2>Select a problem</h2>
      <nav>
        <ul>
          <li>
            <Link to="/problem/1">Problem 1</Link>
          </li>
          <li>
            <Link to="/read/1">Read 1</Link>
          </li>
          <li>
            <Link to="/problem/2">Problem 2</Link>
          </li>
          <li>
            <Link to="/read/2">Read 2</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
