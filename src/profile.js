import React from "react";
import ProfilePic from "./profilepic";
import { BioEditor } from "./bioeditor";

export function Profile(props) {
    console.log("props in Profile: ", props);
    return (
        <div className="profile-container">
            <p className="profile-name">
                {props.first} {props.last}{" "}
            </p>
            <ProfilePic
                className="profile-pic-big"
                profilePicUrl={props.profilePicUrl}
            />
            <BioEditor text={props.bio} onUpdateBio={props.onUpdateBio} />
        </div>
    );
}
