import React from "react";
import axios from "./axios";
import FriendButton from "./friendbutton";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        axios
            .get("/user/" + this.props.match.params.id + "/info")
            .then(
                function(result) {
                    if (result.data.redirectTo) {
                        this.props.history.push(result.data.redirectTo);
                    }
                    this.setState({
                        first: result.data.first,
                        last: result.data.last,
                        id: result.data.id,
                        profilePicUrl: result.data.url,
                        bio: result.data.bio
                    });
                }.bind(this)
            )
            .catch(err => {
                console.log(err);
            });
    }
    render() {
        return (
            <div>
                <FriendButton otherUserId={this.props.match.params.id} />
                <h2>
                    {this.state.first} {this.state.last}
                </h2>
                <img
                    className="profile-pic-big"
                    src={this.state.profilePicUrl}
                />
                <p>{this.state.bio}</p>
            </div>
        );
    }
}
