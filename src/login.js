import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    handleChange(e) {
        this[e.target.name] = e.target.value;
    }
    submit() {
        console.log("this: ", this);
        axios
            .post("/login", {
                first: this.first,
                last: this.last,
                email: this.email,
                password: this.password
            })
            .then(({ data }) => {
                console.log("this is data: ", data);

                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            });
    }
    render() {
        return (
            <div className="login-comp">
                {this.state.error && (
                    <div className="error">Something went wrong!</div>
                )}
                <h2>Log in</h2>
                <input
                    name="email"
                    placeholder="email"
                    onChange={this.handleChange}
                />
                <input
                    name="password"
                    placeholder="password"
                    type="password"
                    onChange={this.handleChange}
                />
                <button onClick={this.submit}>Log in</button>
                <p>
                    No account yet? Register <Link to="/register"> here</Link>
                </p>
            </div>
        );
    }
}
