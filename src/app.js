import React from "react";
import Logo from "./logo";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import { Profile } from "./profile";
import OtherProfile from "./otherprofile";
import Header from "./header";
import { BrowserRouter, Route, Link, Switch, Redirect } from "react-router-dom";
import { ConnectedFriends } from "./friends";
import { ConnectedOnlineUsers } from "./onlineusers";
import { ConnectedChatMessages } from "./chatmessages";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.showUploader = this.showUploader.bind(this);
        this.updateProfileUrl = this.updateProfileUrl.bind(this);
        this.onUpdateBio = this.onUpdateBio.bind(this);
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
            //umjesto first: response.data.first,
            // last: response.data.last,
            // id: response.data.id,
            // profilePicUrl: response.data.url mozda je bolje (({ data })) u setState
            .then(({ data }) => {
                console.log("data: ", data);
                //same as response.data, under
                this.setState(
                    {
                        //this is an object
                        //this is one way to do it, but we will use (({data}))
                        first: data.first,
                        last: data.last,
                        id: data.id,
                        profilePicUrl: data.url,
                        bio: data.bio
                    },
                    () => {
                        console.log("this.state: ", this.state);
                    }
                );
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
            uploaderIsVisible: false,

            profilePicUrl: url
        });
    }

    onUpdateBio(newBio) {
        axios.post("/bio", { text: newBio }).then(() => {
            this.setState({
                bio: newBio
            });
        });
    }

    render() {
        return (
            <div>
                <Header
                    showUploader={this.showUploader}
                    profilePicUrl={this.state.profilePicUrl}
                    updateProfileUrl={this.updateProfileUrl}
                    first={this.state.first}
                    last={this.state.last}
                />
                <BrowserRouter>
                    <div>
                        {this.state.uploaderIsVisible && (
                            <Uploader
                                updateProfileUrl={this.updateProfileUrl}
                            />
                        )}
                        <Switch>
                            <Route
                                exact
                                path="/"
                                render={() => (
                                    <Profile
                                        bio={this.state.bio}
                                        first={this.state.first}
                                        last={this.state.last}
                                        profilePicUrl={this.state.profilePicUrl}
                                        onUpdateBio={this.onUpdateBio}
                                    />
                                )}
                            />
                            <Route path="/user/:id" component={OtherProfile} />
                            <Route
                                path="/friends"
                                render={() => <ConnectedFriends />}
                            />
                            <Route
                                path="/online"
                                render={() => <ConnectedOnlineUsers />}
                            />
                            <Route
                                path="/chat"
                                render={() => <ConnectedChatMessages />}
                            />
                            <Redirect path="*" to="/" />
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
