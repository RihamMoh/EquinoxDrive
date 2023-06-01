import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "./stylesheets/colors.css";
import "./stylesheets/main.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import App from "./App";

window.addEventListener("beforeunload", function (evt) {
  ReactDOM = null;
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
