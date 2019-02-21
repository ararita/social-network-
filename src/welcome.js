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
            <p className="welcome-title">
                {" "}
                Welcome to the Safe House, where good news grow{" "}
            </p>
            <div className="logo-in-welcome">
                <img
                    className="welcome-logo"
                    alt="by @pitygacio"
                    src="/logo-big.png"
                />
            </div>
            <HashRouter>
                <div className="login-register-container">
                    <p className="welcome-info">Please come in:</p>
                    <Route exact path="/" component={Register} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
