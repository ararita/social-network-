import React from "react";
import MusicPlayer from "./musicplayer";

export default class PlayerModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //if uploader is false, should not be on screen, if true, should be on screen;
        };
    }

    render() {
        const className = this.props.playerIsVisible
            ? "front-state"
            : "back-state";
        return (
            <div className={className}>
                <div className="close-btn" onClick={this.props.hidePlayerModal}>
                    x
                </div>
                <MusicPlayer />
            </div>
        );
    }
}
