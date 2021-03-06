import React from "react";

export class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.showEditor = this.showEditor.bind(this);
        this.handleBioChange = this.handleBioChange.bind(this);
        this.updateBio = this.updateBio.bind(this);

        this.state = {
            isEditorVisible: false,
            bio: props.text
        };
    }
    componentDidUpdate(prevProps) {
        if (this.props.text !== prevProps.text) {
            this.setState({
                bio: this.props.text
            });
        }
    }
    showEditor() {
        this.setState({
            isEditorVisible: true
        });
    }
    handleBioChange(e) {
        this.setState({
            bio: e.target.value
        });
    }

    updateBio() {
        this.props.onUpdateBio(this.state.bio);
        this.setState({
            isEditorVisible: false
        });
    }

    render() {
        return (
            <div className="bioeditor-wrapper">
                {this.state.isEditorVisible && (
                    <div className="bio">
                        <textarea
                            className="txt-area-bio"
                            onChange={this.handleBioChange}
                            value={this.state.bio}
                        />
                        <button className="save-btn" onClick={this.updateBio}>
                            save
                        </button>
                    </div>
                )}
                {this.state.bio && !this.state.isEditorVisible && (
                    <div className="bio">
                        <p className="bio-info">{this.state.bio}</p>
                        <div className="update-button-div">
                            <button
                                className="update-button"
                                onClick={this.showEditor}
                            >
                                update
                            </button>
                        </div>
                    </div>
                )}
                {!this.state.bio && !this.state.isEditorVisible && (
                    <div className="bio">
                        <button className="add-btn" onClick={this.showEditor}>
                            Add your bio
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
