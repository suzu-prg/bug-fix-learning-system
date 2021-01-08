import React, { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import { Problem } from "./Problem";
import { Quiz } from "./Quiz";
import { Read } from "./Read";
import firebase from "firebase";
import { SignInScreen } from "./SignInScreen";
import { firebaseApp } from "./firebaseApp";

export const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [myAccount, setMyAccount] = useState<firebase.User>();

  console.log(loading, myAccount);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setLoading(false);
      if (!user) return;
      setMyAccount(user);
    });
  });

  const logout = (): void => {
    firebaseApp.auth().signOut();
    setMyAccount(undefined);
  };

  return (
    <div>
      {loading ? (
        <div>loading...</div>
      ) : !myAccount ? (
        <div>
          <SignInScreen />
        </div>
      ) : (
        <BrowserRouter>
          <Switch>
            <Route path="/quiz/:quizId">
              <Quiz />
            </Route>
            <Route path="/problem/:problemId">
              <Problem />
            </Route>
            <Route path="/read/:readId">
              <Read />
            </Route>
            <Route path="/">
              <Home />
              <button onClick={() => logout()}>Logout</button>
            </Route>
          </Switch>
        </BrowserRouter>
      )}
    </div>
  );
};

export const Home: React.FC = () => {
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
