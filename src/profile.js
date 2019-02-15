import React from "react";
import ProfilePic from "./profilepic";
import { BioEditor } from "./bioeditor";

export function Profile(props) {
    console.log("properties: ", props);
    return (
        <div className="profile-container">
            <ProfilePic
                className="profile-pic-big"
                profilePicUrl={props.profilePicUrl}
            />

            <div className="profile-info">
                <h2>
                    {props.first} {props.last}
                </h2>
                <BioEditor text={props.bio} onUpdateBio={props.onUpdateBio} />
            </div>
        </div>
    );
}
