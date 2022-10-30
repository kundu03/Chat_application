import React, { useContext } from "react";
import Input from "./Input";
import Messages from "./Messages";
import Cam from "../components/Images/cam.png";
import Add from "../components/Images/add.png";
import More from "../components/Images/more.png";
import { ChatContext } from "../Context/ChatContext";

const Chat = () => {
    const {data} = useContext(ChatContext);
    return <div className = "chat">
        <div className = "chatInfo">
            <span>{data.user?.displayName}</span>
            <div className = "chatIcons">
                <img src = {Cam} alt = "/" />
                <img src = {Add} alt = "/" />
                <img src = {More} alt = "/" />
            </div>
        </div>
        <Messages />
        <Input />
    </div>
}

export default Chat;