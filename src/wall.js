import React from "react";
import { connect } from "react-redux";
import axios from "./axios";
import { initSocket } from "./socket";
// import { addWallMessage } from "./actions";
// import ProfilePic from "./profilepic";
// import { Link } from "react-router-dom";

// import MediaCard from "./mediacard";
// import Paper from "@material-ui/core/Paper";

class Wall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPostVisible: true
        };
        // this.uploadPost = this.uploadPost.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
        this.submitToWall = this.submitToWall.bind(this);
    }

    handleChange(e) {
        this.wallInput = e.target.value;
    }

    submit() {
        initSocket().emit("new post from user", {
            messages: this.wallInput,
            first: this.props.first,
            last: this.props.last
        });
        // console.log(this.wallInput);
    }

    submitToWall() {
        axios.post("/wallPost", { urlPost: this.wallInput }).then(results => {
            this.setState({
                wallPost: [results.data[0], ...this.state.wallPost]
            });
            this.wallInput.value = "";
            // console.log("this.state.wallPost:", this.state.wallPost);
            // });
            // console.log("results.data", results.data);
            // let wallPostResults = results.data;
            // wallPostResults.forEach(item => {
            //     this.setState({ wallPost: item });
            //     console.log("wallPost: ", this.state.wallPost);

            // this.state.wallPost.map(item => {
            //     console.log("item in wallPost:", item);
            //     console.log("results in submitToWall:", results);
            // });

            // this.setState({ wallPost: results.data });
            // console.log("this is submitToWall results: ", results);
            // console.log("this is wallpost: ", this.state.wallPost);
            // });
        });
    }
    //inside of then, instead of set state, dispatch the message; the gold is to take the message thats inserted in database, and put it in redux;
    componentDidMount() {
        axios.get("/getWallPosts").then(result => {
            console.log("result in /getwallposts:", result);
            this.setState({ wallPost: result.data });
        });
    }

    render() {
        return (
            <div className="wall-container">
                <div className="post-div">
                    <textarea
                        onChange={this.handleChange}
                        name="wallInput"
                        ref={elem => {
                            this.wallInput = elem;
                        }}
                    />
                    <button onClick={this.submitToWall} className="btn-wall">
                        POST
                    </button>
                </div>
                {this.state.wallPost && (
                    <div className="wallpost-div">
                        {this.state.wallPost.map(item => {
                            return (
                                <div
                                    key={item.id}
                                    className="wallpost-children"
                                >
                                    <img
                                        className="sender-img"
                                        src={item.url || "/default.png"}
                                    />
                                    <p>
                                        {item.created_at} <br />
                                        posted by: {""}
                                        {item.first} {item.last}
                                    </p>

                                    <img
                                        className="link-picture"
                                        src={item.picture}
                                    />
                                    <p>{item.description}</p>
                                    <a target="_blank" href={item.link}>
                                        {item.link}
                                    </a>
                                    <hr />
                                </div>
                            );
                        })}
                    </div>
                )}
                {/*// <MediaCard wallPost={this.state.wallPost} />*/}
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    console.log("state in wall component", state);
    return { posts: state.posts };
};
export default connect(mapStateToProps)(Wall);
