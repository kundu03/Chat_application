import React from "react";
import Sidebar from "../appcomponents/Sidebar";
import Chat from "../appcomponents/Chat";

const Home = () => {
    return (
        <div className = "home">
            <div className = "container">
                <Sidebar />
                <Chat />
            </div>
        </div>
    );
}

export default Home;