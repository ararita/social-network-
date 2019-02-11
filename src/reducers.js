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

    console.log("reducer state: ", state);
    return state;
}
