import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth } from "../configuration/firebase";
import { getAuth, createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            localStorage.setItem('token', user.accessToken);
            localStorage.setItem('user', JSON.stringify(user));

            // Check if is admin
            if (userClaimIsAdmin(user)) {
                navigate("/admin-dashboard"); // admin page
            } else {
                navigate("/user-dashboard"); // user page
            }
        } catch (err) {
            console.error(err);
        }
    };

    const userClaimIsAdmin = (user) => {
        // Check if is admin
        return user && user.customClaims && user.customClaims.admin === true;
    };

    const logout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div><h1 className="title-header">Algorithm Allies Team 6</h1></div>
            <div><h2 id="subtitle-name">Login Page</h2></div>
            <div className="signup-page-content">
            <div className="general-input-box">
                <input
                    placeholder="Email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="general-input-box">
                <input
                    placeholder="Password..."
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <Button variant="secondary" className="signup-button" onClick={signIn}> Sign In</Button>
            <Button variant="secondary" className="signup-button" onClick={logout}> Logout </Button>
            <div className="general-div">
                {user ? (
                    <p>You are logged in as {user.email}</p>
                ) : (
                    <p>You are not logged in</p>
                )}
            </div>
            </div>
        </div>
    );
};
