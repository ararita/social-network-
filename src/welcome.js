import React from "react";
// import axios from "./axios";
// import ReactDOM from "react-dom";
import { Register } from "./register";
import { Login } from "./login";
import { HashRouter, Route, Link } from "react-router-dom";

export function Welcome() {
    return (
        <div className="welcome-container">
            <h1>Welcome to house of good news!</h1>

            <HashRouter>
                <div className="login-register-container">
                    <Route path="/register" component={Register} />
                    <Link to="/register"> Registration </Link>

                    <Route path="/login" component={Login} />
                    <Link to="/login"> Login </Link>
                </div>
            </HashRouter>
        </div>
    );
}
