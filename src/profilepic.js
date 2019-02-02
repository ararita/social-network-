import React from "React";

export default function ProfilePic(props) {
    console.log("props: ", props);

    //props is an object that passes all the data from profilepic to the app

    return (
        <div id="profilepic">
            {props.url ? (
                <img onClick={props.showUploader} src={props.url} />
            ) : (
                <img onClick={props.showUploader} src={props.profilePicUrl} />
            )}
        </div>
    );
}
