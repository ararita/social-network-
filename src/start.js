import React from "react";
import ReactDOM from "react-dom";
import { Welcome } from "./welcome";
// import { Register } from "./register";
import App from "./app";

let renderStuff;

if (location.pathname == "/welcome") {
    renderStuff = <Welcome />;
} else {
    renderStuff = <App />;
}

ReactDOM.render(
    renderStuff,
    document.querySelector("main")
    //ovaj main je main iz htmla, to je root
);
