import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { initSocket } from "./socket";

class ChatMessages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textOfMessage: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }
    componentDidUpdate() {
        if (!this.elem) {
            return null;
        }
        this.elem.scrollTop = this.elem.scrollHeight;
    }
    componentDidMount() {
        if (!this.elem) {
            return null;
        }
        this.elem.scrollTop = this.elem.scrollHeight;
    }
    handleChange(e) {
        this.setState({
            textOfMessage: e.target.value
        });
    }
    sendMessage() {
        initSocket().emit("chatMessageFromUserInput", this.state.textOfMessage);
        this.setState({
            textOfMessage: ""
        });
    }
    render() {
        if (!this.props.chatMessages) {
            return null;
        }
        return (
            <div className="chatMessagesBox">
                <div className="chatMessagesContainer">
                    {this.props.chatMessages.length == 0 && (
                        <p id="noMessagesP">Send message to your friends!</p>
                    )}
                    {this.props.chatMessages && (
                        <div
                            className="chatMessagesContainer-messages"
                            ref={elem => (this.elem = elem)}
                        >
                            {this.props.chatMessages &&
                                this.props.chatMessages.map(msg => {
                                    return (
                                        <div
                                            key={msg.message_id}
                                            className="chatMessageItem"
                                        >
                                            <Link
                                                to={`/user/${msg.sender_id}`}
                                                className="chatMessageItemPicture"
                                            >
                                                <img
                                                    src={
                                                        msg.sender_url ||
                                                        "/profilepic.png"
                                                    }
                                                />
                                            </Link>
                                            <div className="chatMessageItemInfo">
                                                <p>
                                                    <span className="message-sender">
                                                        {msg.sender_first}{" "}
                                                        {msg.sender_last}
                                                    </span>{" "}
                                                    <span className="message-date">
                                                        on{" "}
                                                        {msg.message_created_at.slice(
                                                            0,
                                                            10
                                                        )}
                                                        ,{" "}
                                                        {msg.message_created_at.slice(
                                                            14,
                                                            19
                                                        )}
                                                    </span>
                                                </p>
                                                <p className="message-content">
                                                    {msg.message}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                    <div className="chatMessageInput">
                        <textarea
                            value={this.state.textOfMessage}
                            onChange={this.handleChange}
                        />
                        <button onClick={this.sendMessage}>SEND MESSAGE</button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    if (!state) {
        return null;
    }
    return {
        chatMessages: state.chatMessages
    };
};

export let ConnectedChatMessages = connect(mapStateToProps)(ChatMessages);
