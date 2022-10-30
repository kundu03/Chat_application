import React, { useState } from "react";
import Add from "./Images/addavatar.png"; 
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage} from "../Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc , setDoc } from "firebase/firestore";
import { useNavigate , Link } from "react-router-dom";

const Register = () => {
    const [err , setErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const date = new Date().getTime();
            const storageRef = ref(storage, `${displayName + date}`);
            await uploadBytesResumable(storageRef, file).then(() => {
                getDownloadURL(storageRef).then(async (downloadURL) => {
                  try {
                    await updateProfile(res.user, {
                      displayName,
                      photoURL: downloadURL,
                    });
                    await setDoc(doc(db, "users", res.user.uid), {
                      uid: res.user.uid,
                      displayName,
                      email,
                      photoURL: downloadURL,
                    });
                    await setDoc(doc(db, "userChats", res.user.uid), {});
                    navigate("/");
                  } catch (err) {
                    setErr(true);
                    setLoading(false);
                  }
                });
              });
        }
        catch(err) {
            setErr(true);
            setLoading(false);
        }
    }

    return (
        <div className = "formContainer">
            <div className = "formWrapper">
                <span className = "logo">Friend Chat</span>
                <span className = "title">Register</span>
                <form onSubmit = {handleSubmit}>
                    <input type = "text" placeholder = "Enter name" />
                    <input type = "email" placeholder = "Enter email" />
                    <input type = "password" placeholder = "Enter password" />
                    <input type = "file" style = {{display: "none"}} id = "file" />
                    <label htmlFor = "file">
                        <img src = {Add} alt = "Addavatar" />
                        <span>Add an avatar</span>
                    </label>
                    <button disabled={loading}>Sign up</button>
                    {loading && "Uploading the image please wait..."}
                    {err && <span>Oops, Something Went Wrong!!!</span>}
                </form>
                <p>You do have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    )
}

export default Register;