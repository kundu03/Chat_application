import React, { useState, useRef } from "react";
import { useNavigate , Link } from "react-router-dom";
import { auth, googleAuthProvider } from "../Firebase";
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import google from "./Images/google.png";

const Login = () => {
    const [err, setErr] = useState(false);
    const [error, setError] = useState("Oops! Something went wrong.!!!");
    const emailRef = useRef();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;
        try {
            const user = await signInWithEmailAndPassword(auth, email, password);
            if(user.user.emailVerified) {
                navigate("/");
            } else {
                setErr(true);
                setError("Please verify your email first.");
            }
        }
        catch(err) {
            setErr(true);
            if(err.code === "auth/wrong-password") {
                setError("Wrong password.");
            } else if(err.code === "auth/user-not-found") {
                setError("Email not found.");
            } else {
                setErr("Oops! Something went wrong.!!!");
            }
        }
    };
    const googleLogin = async () => {
        try {
            await signInWithPopup(auth, googleAuthProvider);
            navigate("/");
        }
        catch(err) {
            setErr(true);
            if(err.code === "auth/account-exists-with-different-credential") {
                setErr("User already exists with this email.");
            } else {
                setErr("Oops! Something went wrong.!!!");
            }
        }
    };
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const email = emailRef.current.value;
            await sendPasswordResetEmail(auth, email);
            alert("Password Reset email already sent. Please check your email.");
        }
        catch(err) {
            setErr(true);
        }
    }
    return (
        <div className = "formContainer">
            <div className = "formWrapper">
                <span className = "logo">Friend Chat</span>
                <span className = "title">Login</span>
                <form onSubmit={handleSubmit}>
                    <input type = "email" placeholder = "Enter email" ref={emailRef} required />
                    <input type = "password" placeholder = "Enter password" required />
                    <button>Sign in</button>
                    {err && (
                        <div class="errorshow">
                            <span className="error">{error}</span>
                            {error === "Wrong password." && (
                                <button onClick={handleForgotPassword} className="handleForgotPassword">
                                    Forgot Password
                                </button>
                            )}
                        </div>
                      )}
                </form>
                <div>
                    <button className="LoginButton" onClick={googleLogin}><img className="loginimg" src={google} alt="" /></button>
                </div>
                <div className="links">
                    <button className="navlink1"><Link to="/login" className="link">Login</Link></button>
                    <button className="navlink2"><Link to="/register" className="link">Register</Link></button>
                </div>
            </div>
        </div>
    )
}

export default Login;