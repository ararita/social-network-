import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor() {
        super();
        this.state = {
            //if uploader is false, should not be on screen, if true, should be on screen;
        };
        this.uploadFile = this.uploadFile.bind(this);
    }
    uploadFile(e) {
        e.preventDefault();

        var file = document.getElementById("file");
        var uploadedFile = file.files[0];
        var formData = new FormData();

        formData.append("file", uploadedFile);

        axios
            .post("/upload", formData)
            .then(({ data }) => {
                this.props.updateProfileUrl(data.url);
            })
            .catch(function(err) {
                console.log(err);
            });
    }
    render() {
        return (
            <div className="modal">
                <input id="file" type="file" />
                <button onClick={this.uploadFile}>upload</button>
            </div>
        );
    }
}
