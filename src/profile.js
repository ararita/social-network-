import React from "react";
import ProfilePic from "./profilepic";
import { BioEditor } from "./bioeditor";

export function Profile(props) {
    console.log("properties: ", props);
    return (
        <div className="profile-container">
            <h2>
                {props.first} {props.last}
            </h2>
            <ProfilePic
                className="profile-pic-big"
                profilePicUrl={props.profilePicUrl}
            />

            <BioEditor text={props.bio} onUpdateBio={props.onUpdateBio} />
        </div>
    );
}
