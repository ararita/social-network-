import React from "react";
import { connect } from "react-redux";
import { receiveFriendsWannabes } from "./actions";

class FriendNotifications extends React.Component {
    componentDidMount() {
        this.props.dispatch(receiveFriendsWannabes());
    }

    render() {
        if (this.props.count <= 0 || this.props.count == undefined) {
            return null;
        } else {
            return <div id="friend-notification">{this.props.count}</div>;
        }
    }
}

export default connect(function(state) {
    return {
        // count: state.friends && state.friends.filter(i => i.status == 1).length
    };
})(FriendNotifications);
