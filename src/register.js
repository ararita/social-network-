import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export class Register extends React.Component {
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
            .post("/register", {
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
            <div className="form">
                {this.state.error && (
                    <div className="error">Ooops, something went wrong!</div>
                )}

                <input
                    name="first"
                    placeholder="first name"
                    onChange={this.handleChange}
                />
                <input
                    name="last"
                    placeholder="last name"
                    onChange={this.handleChange}
                />
                <input
                    name="email"
                    placeholder="email"
                    onChange={this.handleChange}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="password"
                    onChange={this.handleChange}
                />
                <button onClick={this.submit}>Register</button>
                <h4>
                    Already a member? <Link to="/login">Login</Link> here!
                </h4>
            </div>
        );
    }
}
