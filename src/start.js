import React from "react";
import ReactDOM from "react-dom";
import { Welcome } from "./welcome";
// import { Register } from "./register";
import { Logo } from "./logo";

let renderStuff;

if (location.pathname == "/welcome") {
    renderStuff = <Welcome />;
} else {
    renderStuff = <Logo />;
}

ReactDOM.render(
    renderStuff,
    document.querySelector("main")
    //ovaj main je main iz htmla, to je root
);
