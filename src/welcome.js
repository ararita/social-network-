import React from "react";
import Logo from "./logo";

// import axios from "./axios";
// import ReactDOM from "react-dom";
import { Register } from "./register";
import { Login } from "./login";

import { HashRouter, Route } from "react-router-dom";

export function Welcome() {
    return (
        <div className="welcome-container">
            <img src="title.png" className="title" />

            <HashRouter>
                <div className="login-register-container">
                    <Logo className="logo-large" />
                    <p>Please come in:</p>
                    <Route exact path="/" component={Register} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
