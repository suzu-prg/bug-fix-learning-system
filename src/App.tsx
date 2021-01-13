import React from "react";
import { Route, Switch } from "react-router-dom";
import { ProblemPage } from "./pages/ProblemPage";
import { QuizPage } from "./pages/QuizPage";
import { ReadPage } from "./pages/ReadPage";
import { HomePage } from "./pages/HomePage";
import { useAuthentication } from "./contexts/AuthenticationContext";

export const App: React.FC = () => {
  const { isFirstGroup, userId, signOut } = useAuthentication();

  return (
    <>
      {
        <>
          {process.env.NODE_ENV === "development" && (
            <div>
              UserId: {userId}, isFirstGroup: {isFirstGroup ? "Yes" : "No"}
            </div>
          )}
          <div>
            <button onClick={signOut}>サインアウト</button>
          </div>
          <Switch>
            <Route path="/quiz/:quizId">
              <QuizPage />
            </Route>
            <Route path="/problem/:problemId">
              <ProblemPage />
            </Route>
            <Route path="/read/:readId">
              <ReadPage />
            </Route>
            <Route path="/">
              <HomePage />
            </Route>
          </Switch>
        </>
      }
    </>
  );
};
