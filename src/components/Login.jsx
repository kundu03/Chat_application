import React, { useState } from "react";
import { useNavigate , Link } from "react-router-dom";
import { auth, googleAuthProvider } from "../Firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import google from "./Images/google.png";

const Login = () => {
    const [err, setErr] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        }
        catch(err) {
            setErr(true);
        }
    };
    const googleLogin = async () => {
        try {
            await signInWithPopup(auth, googleAuthProvider);
            navigate("/");
        }
        catch(err) {
            setErr(true);
        }
    };
    return (
        <div className = "formContainer">
            <div className = "formWrapper">
                <span className = "logo">Friend Chat</span>
                <span className = "title">Login</span>
                <form onSubmit={handleSubmit}>
                    <input type = "email" placeholder = "Enter email" required />
                    <input type = "password" placeholder = "Enter password" required />
                    <button>Sign in</button>
                    {err && <span>Oops! Something went wrong.</span>}
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