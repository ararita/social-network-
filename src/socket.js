//all of our front end code will go here
//receives messages from backend

import * as io from "socket.io-client";
import {
    allOnlineUsers,
    userWhoJoined,
    userWhoLeft,
    getChatMessages,
    loadChatMessage
} from "./actions";

let socket;

export function initSocket(store) {
    if (!socket) {
        //our code will go here inside of if block
        //also all messages from the back-index.js are received WHERE
        //we are listening here from the message that is sent from server: socket.on()
        socket = io.connect();
        socket.on("onlineUsers", function(message) {
            console.log("this is message from online users:", message);
            store.dispatch(allOnlineUsers(message));
        });

        socket.on("userJoined", function(message) {
            store.dispatch(userWhoJoined(message));
        });

        socket.on("userLeft", function(message) {
            store.dispatch(userWhoLeft(message));
        });
        socket.on("chatMessages", function(messages) {
            store.dispatch(getChatMessages(messages));
        });

        socket.on("loadChatMessages", function(newMessage) {
            store.dispatch(loadChatMessage(newMessage));
        });
    }
    return socket;
}
