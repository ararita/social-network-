import React from "react";
import ProfilePic from "./profilepic";
import Logo from "./logo";
import { Link } from "react-router-dom";

export default class Header extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="header-container">
                <Logo className="logo-small" />

                <ProfilePic
                    className="profile-pic-small"
                    showUploader={this.props.showUploader}
                    profilePicUrl={this.props.profilePicUrl}
                    updateProfileUrl={this.props.updateProfileUrl}
                />
                <nav>
                    <Link to="/home" className="links">
                        HOME
                    </Link>
                    <Link to="/friends" className="links">
                        FRIENDS
                    </Link>
                    <Link to="/chat" className="links">
                        CHAT
                    </Link>

                    <Link to="/" className="links">
                        PROFILE
                    </Link>
                    <Link to="/onlineusers" className="links">
                        ONLINE USERS
                    </Link>
                    <a href="/logout" className="links">
                        LOGOUT
                    </a>
                </nav>
            </div>
        );
    }
}
