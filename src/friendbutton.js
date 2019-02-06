import React from "react";
import axios from "./axios";

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.updateFriendship = this.updateFriendship.bind(this);
        this.state = {
            buttonText: "Add friend"
        };
    }

    componentDidMount() {
        //check initial status of friendship:

        axios.get('/initial-friendship-status/' + this.props.otherUserId).then((resp => {
           // check resp, and based off of resp
           // change value of buttonText:

           // if there is no row for the two users
           // - button says "make friend request"
           // - clicking button makes ajax request that does INSERT
           if(resp.data.data.length == 0) {
               this.setState(() => {
                   return {buttonText: "Add friend"}
           })
}
//If there is a row for the two users:
//- if the the accepted column is true
  // - button says "unfriend"
  // - clicking button makes ajax request that does DELETE:
else if (resp.data.data[0].accepted == true) {
    this.setState(() => {
        return{buttonText: "Unfriend"}
    })
}
// - button says "cancel request"
//     - clicking button makes ajax request that does DELETE of row containing ids of the two users involved:
else if(resp.data.data[0].accepted == false && resp.data.data[0].sender_id == resp.data.user) {
    this.setState(() => {
        return{buttonText: "Cancel friend request"}
    })
}

// - if accepted is false
//     - button says "accept"
//     - clicking button makes ajax request that does UPDATE of accepted column:
else if(resp.data.data[0].accepted == false && resp.data.data[0].sender_id !== resp.data.user) {
    this.setState(() => {
        return{buttonText: "Accept friend request"}
    });

               }
           })


updateFriendship() {
        //depending what the button says, do different thing

        if(this.state.buttonText == "Add Friend"){
        axios.post('/initial-friendship-status/' + this.props.otherUserId+ '/add-friend').then((resp)=>{

        })
        this.setState(()=>{
            return {buttonText: "Cancel Friend Request"}
        })
    } else if (this.state.buttonText = "Unfriend") {
        axios.post('/initial-friendship-status/' + this.props.otherUserId+ '/unfriend').then((resp)=>{

        })
        this.setState(()=>{
            return {buttonText: "Add friend"}
        })
    } else if (this.state.buttonText = "Cancel friend request") {
        axios.post('/initial-friendship-status/' + this.props.otherUserId+ '/cancel-friend-request').then((resp)=>{

        })
        this.setState(()=>{
            return {buttonText: "Add friend"}
        })

    } else if (this.state.buttonText = "Accept friend request") {
        axios.post('/initial-friendship-status/' + this.props.otherUserId+ '/accept-friend-request').then((resp)=>{

        })
        this.setState(()=>{
            return {buttonText: "Unfriend"}
        });
            }
        });
    }
render() {
    return (
        <div>
            <button onClick={this.updateFriendship}>{this.state.buttonText}</button>
        </div>
    );
}
}
