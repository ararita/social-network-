import React from "react";
import ProfilePic from "./profilepic";
import Logo from "./logo";

export default function Header(props) {
    return (
        <div>
            <div className="header-container">
                <div className="logo-box">
                    <Logo />
                </div>

                <div>
                    <ProfilePic
                        className="profile-pic-small"
                        showUploader={props.showUploader}
                        profilePicUrl={props.profilePicUrl}
                        updateProfileUrl={props.updateProfileUrl}
                    />
                </div>
            </div>
        </div>
    );
}
