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
                <Logo
                    className="logo-small"
                    showMusicPlayer={this.props.showMusicPlayer}
                />

                <ProfilePic
                    className="profile-pic-small"
                    showUploader={this.props.showUploader}
                    profilePicUrl={this.props.profilePicUrl}
                    updateProfileUrl={this.props.updateProfileUrl}
                />
                <nav>
                    <Link to="/home" className="links">
                        Home
                    </Link>
                    <Link to="/friends" className="links">
                        Friends
                    </Link>
                    <Link to="/chat" className="links">
                        Chat
                    </Link>

                    <Link to="/" className="links">
                        Profile
                    </Link>
                    <Link to="/onlineusers" className="links">
                        Online users
                    </Link>
                    <a href="/logout" className="links">
                        Logout
                    </a>
                </nav>
            </div>
        );
    }
}
