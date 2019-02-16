import React from "react";
import { connect } from "react-redux";
import axios from "./axios";
import { initSocket } from "./socket";
import { addWallMessage } from ".actions";
import ProfilePic from "./profilepic";

class Wall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { posts } = this.props;

        if (!posts) {
            return null;
        }
    }
}
