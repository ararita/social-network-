import React from "react";
import { connect } from "react-redux";
import {
    receiveFriendsWannabes,
    acceptFriendRequest,
    unFriend
} from "./actions";
import { Link } from "react-router-dom";

export class Friends extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.dispatch(receiveFriendsWannabes());
    }
    render() {
        return (
            <div className="friends-wrapper">
                <div className="friends-box">
                    <h2>Pending friend requests:</h2>

                    {this.props.wannabes &&
                        this.props.wannabes.map(i => {
                            return (
                                <div className="friend-info-div" key={i.id}>
                                    <div className="each-div">
                                        {
                                            <Link
                                                to={`/user/${i.id}`}
                                                key={i.id}
                                            >
                                                <div>
                                                    <img
                                                        className="friend-img"
                                                        src={
                                                            i.url ||
                                                            "/default.png"
                                                        }
                                                    />
                                                </div>
                                                <div className="friend-name">
                                                    {i.first} {i.last}
                                                </div>
                                            </Link>
                                        }
                                    </div>
                                    <div className="each-div">
                                        <button
                                            onClick={() =>
                                                this.props.dispatch(
                                                    acceptFriendRequest(i.id)
                                                )
                                            }
                                        >
                                            ACCEPT
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <div className="friends-box">
                    <h2>List of friends:</h2>

                    {this.props.friends &&
                        this.props.friends.map(i => {
                            return (
                                <div className="friend-info-div" key={i.id}>
                                    {
                                        <Link to={`/user/${i.id}`} key={i.id}>
                                            {i.first} {i.last}
                                            <img
                                                className="friend-img"
                                                src={i.url || "/default.png"}
                                            />
                                        </Link>
                                    }

                                    <button
                                        onClick={() =>
                                            this.props.dispatch(unFriend(i.id))
                                        }
                                    >
                                        REMOVE FRIEND
                                    </button>
                                </div>
                            );
                        })}
                </div>{" "}
            </div>
        );
    }
}

//this function will run everytime the redux state is updated
const mapStateToProps = function(state) {
    if (!state) {
        return null;
    }
    // console.log("state in mapStateToProps: ", state);
    if (!state.friendsList) {
        return {};
    } else {
        return {
            friends: state.friendsList.filter(i => {
                if (i.accepted) {
                    return true;
                } else {
                    return false;
                }
            }),
            wannabes: state.friendsList.filter(i => {
                if (!i.accepted) {
                    return true;
                } else {
                    return false;
                }
            })
        };
    }
};

export let ConnectedFriends = connect(mapStateToProps)(Friends);
