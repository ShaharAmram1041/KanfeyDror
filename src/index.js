import React from "react";
import ReactDOM from "react-dom/client"; // Import createRoot from "react-dom/client"
import App from "./App";
import "./Styles/index.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
