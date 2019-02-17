import React from "react";
import { connect } from "react-redux";
import axios from "./axios";
import { initSocket } from "./socket";
import { addWallMessage } from "./actions";
import ProfilePic from "./profilepic";

class Wall extends React.Component {
    constructor(props) {
        super(props);
        // this.state = { isPostVisible: true };
        // this.uploadPost = this.uploadPost.bind(this);
        // this.handleChange = this.handleChange.bind(this);
        // this.submit = this.submit.bind(this);
    }

    handleChange(e) {
        this.wallInput = e.target.value;
    }

    submit() {}

    render() {
        return (
            <div className="wall-container">
                <textarea />
                <button>post</button>
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    return { posts: state.posts };
};
export default connect(mapStateToProps)(Wall);
