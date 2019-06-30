export function reducer(state = {}, action) {
    if (action.type == "RECEIVE_FRIENDS_WANNABEES") {
        // console.log("in reducer now");
        return { ...state, friendsList: action.list };
        // console.log("this is state from reducer", state);
        // return state;
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
        // console.log("action.onlineUsersList", action.onlineUsersList);
        state = {
            ...state,
            onlineUsers: action.onlineUsersList
        };
        // console.log("state from reducer: ", state);
        return state;
    }

    if (action.type == "USER_WHO_JOINED") {
        // console.log("action.joined", action.joined);
        state = {
            ...state,
            onlineUsers: state.onlineUsers.concat(action.joined)
        };
        return state;
    }

    if (action.type == "USER_WHO_LEFT") {
        // console.log("action.leftUser", action.leftUser);
        state = {
            ...state,
            onlineUsers: state.onlineUsers.filter(i => {
                if (i.id == action.leftUser) {
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

    if (action.type == "GET_WALL_POSTS") {
        state = {
            ...state,
            posts: action.posts
        };
        return state;
    }

    if (action.type == "ADD_WALL_POST") {
        state = {
            ...state,
            posts: state.posts.concat(action.post)
        };
        return state;
    }

    // console.log("reducer state: ", state);
    return state;
}
