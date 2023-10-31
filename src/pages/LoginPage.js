import '../styles/App.css';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth } from "../configuration/firebase";
import { getAuth, createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const LoginPage = () => {
    const [email, setEmail] = useContext(AuthContext).email;
    const [password, setPassword] = useContext(AuthContext).password;
    const [user, setUser] = useContext(AuthContext).user;
    const navigate = useNavigate();

    const signIn = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user
            localStorage.setItem('token', user.accessToken);
            localStorage.setItem('user', JSON.stringify(user));
            setEmail("");
            setPassword("");
        } catch (err) {
            console.error(err);
        }
    };

    const logoutButton = useContext(AuthContext).logoutButton
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        await signIn();
        navigate("/");
    }

    return (
        <div>
            <h2 id="subtitle-name">Login Page</h2>
            <div className="signup-page-content">
                <form onSubmit={handleSubmit}>

                    <input
                        placeholder="Email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />


                    <input
                        placeholder="Password..."
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    { !user && <Button type="submit" variant="secondary" className="signup-button"> Sign In</Button>}
                    { user && <Button type="button" variant="secondary" className="signup-button" onClick={logoutButton}> Logout </Button>}
                </form>

                <div className="general-div">
                    {user ? (
                        <p>You are logged in as {user.email}</p>
                    ) : (
                        <p>You are not logged in. <Link to="/signup">Signup</Link></p>
                    )}
                </div>
            </div>
        </div>
    );
};
