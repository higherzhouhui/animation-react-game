import "./polyfill";
import "core-js/es";
import "mutation-observer";
import "react-app-polyfill/ie9";
import "react-app-polyfill/stable";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import ContextReducer from "./state/useAction";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <ContextReducer.Provider>
      <App />
    </ContextReducer.Provider>
  );
}
