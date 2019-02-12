import React from "react";
import { connect } from "react-redux";
// import { Link } from "react-router-dom";
import { allOnlineUsers } from "./actions";

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

        const listOnlineUsers = (
            <div>
                {onlineUsers.map(user => {
                    return (
                        <div key={user.id}>
                            <img src={user.url || "/public/default.png"} />
                            <p>
                                {user.first}
                                {user.last}
                            </p>
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
