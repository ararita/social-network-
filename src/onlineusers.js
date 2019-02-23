import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// import { allOnlineUsers } from "./actions";

class OnlineUsers extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {};
    }

    render() {
        const { onlineUsers } = this.props;
        if (!onlineUsers) {
            return null;
        }
        console.log(onlineUsers);
        const listOnlineUsers = (
            <div className="online-users-wrapper">
                {onlineUsers.map((user, i) => {
                    return (
                        <div className="online-user-div" key={i}>
                            <div className="online-box">
                                <img
                                    className="online-img"
                                    src={user.url || "/default.png"}
                                />
                                <Link to={`/user/${user.id}`}>
                                    <p>
                                        {user.first} {""}
                                        {user.last}
                                    </p>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        );

        return (
            <div>
                <div>
                    {!onlineUsers.length && <h3>Nobody is online</h3>}
                    {onlineUsers && listOnlineUsers}
                </div>
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    if (!state) {
        return null;
    }
    console.log("this is state: ", state);
    if (!state.onlineUsers) {
        return {};
    } else {
        return {
            onlineUsers: state.onlineUsers
        };
    }
};

export let ConnectedOnlineUsers = connect(mapStateToProps)(OnlineUsers);
