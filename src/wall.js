import React from "react";
import { connect } from "react-redux";
import axios from "./axios";
import { initSocket } from "./socket";
import { addWallMessage } from "./actions";
import ProfilePic from "./profilepic";

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
                wallPost: [...this.state.wallPost, results.data[0]]
            });
            console.log("this.state.wallPost:", this.state.wallPost);
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
                <textarea onChange={this.handleChange} name="wallInput" />
                <button onClick={this.submitToWall} className="btn__wall">
                    POST
                </button>

                {this.state.wallPost && (
                    <div>
                        {this.state.wallPost.map(item => {
                            return (
                                <div key={item.id}>
                                    <img
                                        className="link-picture"
                                        src={item.picture}
                                    />
                                    <p>{item.description}</p>
                                    <p>{item.link}</p>
                                    <img className="link-url" src={item.url} />
                                    <p>{item.created_at} by</p>
                                    <p>
                                        {item.first} {item.last}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    return { posts: state.posts };
};
export default connect(mapStateToProps)(Wall);
