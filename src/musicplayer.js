import _ from "lodash";
import React, { Component } from "react";
// import ReactDOM from "react-dom";
import YTSearch from "youtube-api-search";
import SearchBar from "./search_bar";
import VideoDetail from "./video_detail";
const API_KEY = "AIzaSyDWddyivdYCxyNrZK_6aAd9dUHL3oOxMO0";

class MusicPlayer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            videos: [],
            selectedVideo: null
        };

        // this.videoSearch("mayalaitdecoco");
    }

    videoSearch(term) {
        YTSearch({ key: API_KEY, term: term }, videos => {
            this.setState({
                videos: videos,
                selectedVideo: videos[0]
            });
        });
    }

    render() {
        const videoSearch = _.debounce(term => {
            this.videoSearch(term);
        }, 300);

        return (
            <div className="video-div">
                <VideoDetail
                    className="video"
                    video={this.state.selectedVideo}
                />
                <SearchBar onSearchTermChange={videoSearch} />
            </div>
        );
    }
}

export default MusicPlayer;
