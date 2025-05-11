import React, { useState } from "react";
import Add from "./Images/addavatar.png"; 
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, sendEmailVerification } from "firebase/auth";
import { auth, db, storage, googleAuthProvider} from "../Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc , setDoc } from "firebase/firestore";
import { useNavigate , Link } from "react-router-dom";
import google from "./Images/google.png";

const Register = () => {
    const [err , setErr] = useState(false);
    const [error, setError] = useState("Oops, Something Went Wrong!!!");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];
        if(!file) {
            setErr(true);
            setError("!!! Please select an Avatar. !!!");
            setLoading(false);
        } else {
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
                        await sendEmailVerification(res.user);
                        navigate("/login");
                        alert("Please check your inbox to verify your email.");
                      } catch (err) {
                        setErr(true);
                        setLoading(false);
                      }
                    });
                  });
            }
            catch(err) {
                setErr(true);
                if(err.code === "auth/invalid-email") {
                    setError("Invalid email id.");
                } else if(err.code === "auth/email-already-in-use") {
                    setError("User already exists with this email.");
                } else if(err.code === "auth/weak-password") {
                    setError("Weak Password - minimum 6 chars.")
                } else {
                    setError("Oops! Something went wrong.!!!");
                }
                setLoading(false);
            }
        }
    }
    const googleLogin = async () => {
        try {
            await signInWithPopup(auth, googleAuthProvider);
            navigate("/");
        }
        catch(err) {
            setErr(true);
            if(err.code === "auth/account-exists-with-different-credential") {
                setError("User already exists with this email.");
            } else {
                setError("Oops! Something went wrong.!!!");
            }
        }
    };
    return (
        <div className = "formContainer">
            <div className = "formWrapper">
                <span className = "logo">Friend Chat</span>
                <span className = "title">Register</span>
                <form onSubmit = {handleSubmit}>
                    <input type = "text" placeholder = "Enter name" required />
                    <input type = "email" placeholder = "Enter email" required />
                    <input type = "password" placeholder = "Enter password" required />
                    <input type = "file" style = {{display: "none"}} id = "file" />
                    <label htmlFor = "file">
                        <img src = {Add} alt = "Addavatar" />
                        <span>Add an avatar</span>
                    </label>
                    <button disabled={loading}>Sign up</button>
                    {loading && <span className="error">Uploading the image please wait...</span>}
                    {err && <span className="error">{error}</span>}
                </form>
                <div>
                    <button className="LoginButton" onClick={googleLogin}><img className="loginimg" src={google} alt="" /></button>
                </div>
                <div className="links">
                    <button className="navlink2"><Link to="/login" className="link">Login</Link></button>
                    <button className="navlink1"><Link to="/register" className="link">Register</Link></button>
                </div>
            </div>
        </div>
    )
}

export default Register;