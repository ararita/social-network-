import React from "react";
import { connect } from "react-redux";
import axios from "./axios";
import { initSocket } from "./socket";
import { addWallMessage } from "./actions";
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
        return (
            <div className="wall-container">
                <h1>this is the wall</h1>
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    return { posts: state.posts };
};
export default connect(mapStateToProps)(Wall);
