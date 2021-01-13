import React from "react";
import { Link } from "react-router-dom";
import { useAuthentication } from "../contexts/AuthenticationContext";

export const HomePage: React.FC = () => {
  const { loading, isFirstGroup, userId, signOut } = useAuthentication();

  return (
    <div>
      <h2>Select a problem</h2>
      問題1，問題2の順に解答してください
      <br />
      <br />
      {isFirstGroup ? (
        <nav>
          <li>
            <Link to="/problem/1">問題1</Link>
          </li>
          <li>
            <Link to="/read/2">問題2</Link>
          </li>
        </nav>
      ) : (
        <nav>
          <li>
            <Link to="/read/1">問題1</Link>
          </li>
          <li>
            <Link to="/problem/2">問題2</Link>
          </li>
        </nav>
      )}
      <br />
      問題2を解き終わったら，以下のアンケートに回答をお願いします
      <br />
      <a href="https://forms.gle/hfA12Dv1eDA36iMM9">
        https://forms.gle/hfA12Dv1eDA36iMM9
      </a>
    </div>
  );
};
