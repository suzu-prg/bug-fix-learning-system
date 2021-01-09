import { render } from "react-dom";
import React from "react";
import { App } from "./App";
import { AuthenticationProvider } from "./contexts/AuthenticationContext";
import { BrowserRouter } from "react-router-dom";

render(
  <BrowserRouter>
    <AuthenticationProvider>
      <App />
    </AuthenticationProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
