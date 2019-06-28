import React from "react";
import axios from "./axios";

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.updateFriendship = this.updateFriendship.bind(this);
        this.state = {
            buttonText: ""
        };
    }

    componentDidMount() {
        axios
            .get("/initial-friendship-status/" + this.props.otherUserId)
            .then(resp => {
                if (resp.data.length == 0) {
                    this.setState({ buttonText: "Add friend" });
                } else if (resp.data.accepted == true) {
                    this.setState({ buttonText: "Unfriend" });
                } else if (
                    resp.data.accepted == false &&
                    resp.data.sender_id != this.props.otherUserId
                ) {
                    this.setState({ buttonText: "Cancel friend request" });
                } else if (
                    resp.data.accepted == false &&
                    resp.data.sender_id == this.props.otherUserId
                ) {
                    this.setState({
                        buttonText: "Accept friend request"
                    });
                }
            });
    }
    updateFriendship() {
        if (this.state.buttonText == "Add friend") {
            axios.post(
                "/initial-friendship-status/" +
                    this.props.otherUserId +
                    "/add-friend"
            );
            this.setState(() => {
                return { buttonText: "Cancel friend request" };
            });
        } else if (this.state.buttonText == "Unfriend") {
            axios.post(
                "/initial-friendship-status/" +
                    this.props.otherUserId +
                    "/unfriend"
            );
            this.setState(() => {
                return { buttonText: "Add friend" };
            });
        } else if (this.state.buttonText == "Cancel friend request") {
            axios.post(
                "/initial-friendship-status/" +
                    this.props.otherUserId +
                    "/cancel-friend-request"
            );
            this.setState(() => {
                return { buttonText: "Add friend" };
            });
        } else if (this.state.buttonText == "Accept friend request") {
            axios.post(
                "/initial-friendship-status/" +
                    this.props.otherUserId +
                    "/accept-friend-request"
            );
            this.setState(() => {
                return { buttonText: "Unfriend" };
            });
        }
    }

    render() {
        return (
            <div>
                <button
                    className="friend-button"
                    onClick={this.updateFriendship}
                >
                    {this.state.buttonText}
                </button>
            </div>
        );
    }
}
