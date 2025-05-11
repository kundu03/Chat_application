import React, { useContext, useState, useEffect } from "react";
import Img from "../components/Images/img.png";
import Attach from "../components/Images/attach.png";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "../Firebase";
import { v4 as uuid} from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);
    const [imgUrl, setImgUrl] = useState(null);
    const {currentUser} = useContext(AuthContext);
    const {data} = useContext(ChatContext);
    useEffect(() => {
        if(img) {
            setImgUrl(URL.createObjectURL(img));
            return () => URL.revokeObjectURL(img);
        } else {
            setImgUrl(null);
        }
      }, [img]);
    const handleSend = async () => {
        try {
            if(img)
            {
                const storageRef = ref(storage, uuid());
                const uploadTask = uploadBytesResumable(storageRef, img);
                uploadTask.on("state_changed", null,
                    (error) => {

                    },
                    () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateDoc(doc(db, "chats", data.chatID), {
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId: currentUser.uid,
                                date: Timestamp.now(),
                                img: downloadURL,
                            }),
                        });
                    });
                });
            }
            else
            {
                await updateDoc(doc(db,"chats",data.chatID), {
                    messages: arrayUnion({
                        id: uuid(),
                        text,
                        senderId: currentUser.uid,
                        date: Timestamp.now(),
                    })
                });
            }
            await updateDoc(doc(db, "userChats", currentUser.uid),{
                [data.chatID + ".lastMessage"]: {
                    text,
                },
                [data.chatID + ".date"]: serverTimestamp(),
            })
            await updateDoc(doc(db, "userChats", data.user.uid),{
                [data.chatID + ".lastMessage"]: {
                    text,
                },
                [data.chatID + ".date"]: serverTimestamp(),
            })
            setText("");
            setImg(null);
        }
        catch(err) {
            console.log(err);
        }
    }
    return <div className = "input">
        <input type = "text" placeholder = "Type something..." onChange = {(e) => setText(e.target.value)} value = {text} />
        <div className = "send">
            <img src = {Attach} alt = "/" />
            <input type = "file" style = {{display: "none"}} id = "file" onChange={(e) => setImg(e.target.files[0])} />
            <label htmlFor = "file">
                <img src = {Img} alt = "/" />
            </label>
            <button onClick = {handleSend} disabled={text === "" && img === null}>Send</button>
        </div>
        {img != null && (<div>
            <img className="chatImg" src={imgUrl} alt={img} />
            <button className="cancelbutton" onClick={() => setImg(null)}>X</button>
        </div>)}
    </div>
}

export default Input;