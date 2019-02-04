import React from "react";
import { ProfilePic } from "./profilepic";
import { BioEditor } from "./bioeditor";

export function Profile(props) {
    console.log("properties: ", props);
    return (
        <div>
            <div>
                <ProfilePic
                    className="profile-pic-big"
                    first={props.first}
                    last={props.last}
                    profilePicUrl={props.profilePicUrl}
                />
            </div>

            <div className="user-name">
                <h2>
                    {props.first} {props.last}
                </h2>
                <BioEditor text={props.bio} onUpdateBio={props.onUpdateBio} />
            </div>
        </div>
    );
}
