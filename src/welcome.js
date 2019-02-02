import React from "react";
import axios from "./axios";
import ReactDOM from "react-dom";
import { Register } from "./register";
import { Login } from "./login";
import { HashRouter, Route, Link } from "react-router-dom";

export function Welcome() {
    return (
        <div className="welcome">
            <h1>Welcome user!</h1>

            <HashRouter>
                <div>
                    <Route path="/register" component={Register} />
                    <Route path="/login" component={Login} />
                    <Link to="/register"> Registration </Link>
                    <Link to="/login"> Login </Link>
                </div>
            </HashRouter>
        </div>
    );
}
