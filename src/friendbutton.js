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
        //check initial status of friendship:

        axios
            .get("/initial-friendship-status/" + this.props.otherUserId)
            .then(resp => {
                console.log("resp: ", resp);
                console.log("this.props.otherUserId: ", this.props.otherUserId);
                // check resp, and based off of resp
                // change value of buttonText:

                // if there is no row for the two users
                // - button says "make friend request"
                // - clicking button makes ajax request that does INSERT
                if (resp.data.length == 0) {
                    this.setState({ buttonText: "Add friend" });
                }
                //If there is a row for the two users:
                //- if the the accepted column is true
                // - button says "unfriend"
                // - clicking button makes ajax request that does DELETE:
                else if (resp.data.accepted == true) {
                    this.setState({ buttonText: "Unfriend" });
                }
                // - button says "cancel request"
                //     - clicking button makes ajax request that does DELETE of row containing ids of the two users involved:
                else if (
                    resp.data.accepted == false &&
                    resp.data.sender_id != this.props.otherUserId
                ) {
                    this.setState({ buttonText: "Cancel friend request" });
                }

                // - if accepted is false
                //     - button says "accept"
                //     - clicking button makes ajax request that does UPDATE of accepted column:
                else if (
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
        //depending what the button says, do different thing

        if (this.state.buttonText == "Add friend") {
            axios.post(
                "/initial-friendship-status/" +
                    this.props.otherUserId +
                    "/add-friend"
            );
            // .then(resp => {});
            this.setState(() => {
                return { buttonText: "Cancel friend request" };
            });
        } else if (this.state.buttonText == "Unfriend") {
            axios.post(
                "/initial-friendship-status/" +
                    this.props.otherUserId +
                    "/unfriend"
            );
            // .then(resp => {});
            this.setState(() => {
                return { buttonText: "Add friend" };
            });
        } else if (this.state.buttonText == "Cancel friend request") {
            axios.post(
                "/initial-friendship-status/" +
                    this.props.otherUserId +
                    "/cancel-friend-request"
            );
            // .then(resp => {});
            this.setState(() => {
                return { buttonText: "Add friend" };
            });
        } else if (this.state.buttonText == "Accept friend request") {
            axios.post(
                "/initial-friendship-status/" +
                    this.props.otherUserId +
                    "/accept-friend-request"
            );
            // .then(resp => {});
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
