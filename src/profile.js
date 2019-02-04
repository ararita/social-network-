import React from "react";
import { ProfilePic } from "./profilepic";
import { BioEditor } from "./bioeditor";

export function Profile(props) {
    return (
        <div>
            <div>
                <ProfilePic
                    className="profile-pic"
                    firstName={props.user.first}
                    lastName={props.user.last}
                    url={props.user.profilePicUrl}
                />
            </div>

            <div className="user-name">
                <h2>
                    {props.user.first} {props.user.last}
                </h2>
                <BioEditor
                    text={props.user.bio}
                    onUpdateBio={props.onUpdateBio}
                />
            </div>
        </div>
    );
}
