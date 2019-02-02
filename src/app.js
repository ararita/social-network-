import React from "react";
import { Logo } from "./logo";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.showUploader = this.showUploader.bind(this);
        this.updateProfileUrl = this.updateProfileUrl.bind(this);
        this.state = {
            uploaderIsVisible: false
        };

        // this.changePictureUrl = this.changePictureUrl.bind(this);---pitaj sta znaci
    }

    //this is equivalent of vue mounted
    //a lifecycle method
    componentDidMount() {
        axios
            .get("/user")
            .then(response => {
                this.setState({
                    //this is an object
                    first: response.data.first,
                    last: response.data.last,
                    id: response.data.id,
                    profilePicUrl: response.data.url
                });
            })
            .catch(err => {
                console.log(err);
            });
    }
    showUploader() {
        this.setState({
            uploaderIsVisible: true
        });
    }

    updateProfileUrl(url) {
        this.setState({
            profilePicUrl: url,
            uploaderIsVisible: false
        });
    }
    render() {
        return (
            <div>
                <Logo />
                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    profilePicUrl={this.state.profilePicUrl}
                    showUploader={this.showUploader}
                />
                {this.state.uploaderIsVisible && (
                    <Uploader updateProfileUrl={this.updateProfileUrl} />
                )}

                <h1>Welcome, {this.state.first} </h1>
            </div>
        );
    }
}
