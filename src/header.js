import React from "react";
import ProfilePic from "./profilepic";
import Logo from "./logo";

export default function Header(props) {
    return (
        <div className="header-container">
            <Logo className="logo-small" />

            <ProfilePic
                className="profile-pic-small"
                showUploader={props.showUploader}
                profilePicUrl={props.profilePicUrl}
                updateProfileUrl={props.updateProfileUrl}
            />
            <nav>
                <a href="/home" className="links">
                    HOME
                </a>
                <a href="/friends" className="links">
                    FRIENDS
                </a>
                <a href="/chat" className="links">
                    CHAT
                </a>

                <a href="/profile" className="links">
                    PROFILE
                </a>
                <a href="/onlineusers" className="links">
                    ONLINE USERS
                </a>
                <a href="/logout" className="links">
                    LOGOUT
                </a>
            </nav>
        </div>
    );
}
