export function reducer(state = {}, action) {
    if (action.type == "RECEIVE_FRIENDS_WANNABEES") {
        // console.log("in reducer now");
        const state = { ...state, friendsList: action.list };
        return state;
    }
    if (action.type == "ACCEPT_FRIEND_REQUEST") {
        return {
            ...state,
            friendsList: state.friendsList.map(i => {
                if (i.id == action.id) {
                    return { ...i, accepted: true };
                } else {
                    return i;
                }
            })
        };
    }

    if (action.type == "UNFRIEND") {
        return {
            ...state,
            friendsList: state.friendsList.filter(i => {
                if (i.id == action.id) {
                    return false;
                } else {
                    return true;
                }
            })
        };
    }

    if (action.type == "ONLINE_USERS") {
        console.log("action.onlineUsersList", action.onlineUsersList);
        state = {
            ...state,
            onlineUsers: action.onlineUsersList
        };
        console.log("state from reducer: ", state);
        return state;
    }

    if (action.type == "USER_WHO_JOINED") {
        state = {
            ...state,
            onlineUsers: state.onlineUsers.concat(action.joined)
        };
        return state;
    }

    if (action.type == "USER_WHO_LEFT") {
        state = {
            ...state,
            onlineUsers: state.onlineUsers.filter(i => {
                if (i.leftUser == action.leftUser) {
                    return false;
                } else {
                    return true;
                }
            })
        };
    }

    if (action.type == "GET_CHAT_MESSAGES") {
        state = {
            ...state,
            chatMessages: action.messages
        };
        return state;
    }

    if (action.type == "LOAD_CHAT_MESSAGE") {
        state = {
            ...state,
            chatMessages: state.chatMessages.concat(action.newMessage)
        };
        return state;
    }

    console.log("reducer state: ", state);
    return state;
}
