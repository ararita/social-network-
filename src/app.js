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
import Wall from "./wall";
import PlayerModal from "./playermodal";

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            uploaderIsVisible: false,
            showMusicPlayer: false
        };
        this.showUploader = this.showUploader.bind(this);
        this.updateProfileUrl = this.updateProfileUrl.bind(this);
        this.onUpdateBio = this.onUpdateBio.bind(this);
        this.showMusicPlayer = this.showMusicPlayer.bind(this);
        this.hidePlayerModal = this.hidePlayerModal.bind(this);
    }

    componentDidMount() {
        axios
            .get("/user")
            .then(({ data }) => {
                // console.log("data: ", data);
                this.setState(
                    {
                        first: data.first,
                        last: data.last,
                        id: data.id,
                        profilePicUrl: data.url,
                        bio: data.bio
                    },
                    () => {
                        // console.log("this.state: ", this.state);
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

    showMusicPlayer() {
        this.setState({
            playerIsVisible: true
        });
    }

    hidePlayerModal() {
        this.setState({
            playerIsVisible: false
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
            <BrowserRouter>
                <div>
                    <Header
                        showUploader={this.showUploader}
                        showMusicPlayer={this.showMusicPlayer}
                        profilePicUrl={this.state.profilePicUrl}
                        updateProfileUrl={this.updateProfileUrl}
                        first={this.state.first}
                        last={this.state.last}
                    />
                    <div>
                        {this.state.uploaderIsVisible && (
                            <Uploader
                                updateProfileUrl={this.updateProfileUrl}
                            />
                        )}
                        <PlayerModal
                            playerIsVisible={this.state.playerIsVisible}
                            hidePlayerModal={this.hidePlayerModal}
                        />

                        <Switch>
                            <Route
                                exact
                                path="/"
                                render={() => (
                                    <div className="profile-div">
                                        <Profile
                                            bio={this.state.bio}
                                            first={this.state.first}
                                            last={this.state.last}
                                            profilePicUrl={
                                                this.state.profilePicUrl
                                            }
                                            onUpdateBio={this.onUpdateBio}
                                        />
                                    </div>
                                )}
                            />

                            <Route
                                path="/home"
                                render={() => (
                                    <Wall
                                        first={this.state.first}
                                        last={this.state.last}
                                        profilePicUrl={this.state.profilePicUrl}
                                    />
                                )}
                            />
                            <Route path="/user/:id" component={OtherProfile} />
                            <Route
                                path="/friends"
                                render={() => <ConnectedFriends />}
                            />
                            <Route
                                path="/onlineusers"
                                render={() => <ConnectedOnlineUsers />}
                            />
                            <Route
                                path="/chat"
                                render={() => <ConnectedChatMessages />}
                            />
                            <Redirect path="*" to="/" />
                        </Switch>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}
