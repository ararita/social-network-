import React from "React";

export default function ProfilePic(props) {
    console.log("confirm: ", props);
    let imageUrl;

    if (props.profilePicUrl) {
        imageUrl = props.profilePicUrl;
    } else {
        imageUrl = "/default.png";
    }

    //props is an object that passes all the data from profilepic to the app

    return (
        <div>
            <img
                className={props.className}
                src={imageUrl}
                alt={`${props.first} ${props.last}`}
                onClick={props.showUploader}
            />
        </div>
    );
}
//alt is when the image doesnt render;

// {props.url ? (
//     <img onClick={props.showUploader} src={props.url} />
// ) : (
//     <img onClick={props.showUploader} src={props.profilePicUrl} />
// )}
