import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Button } from 'react-bootstrap';

export const NavBar = () => {
    const [user, setUser] = useContext(AuthContext).user;
    const logoutButton = useContext(AuthContext).logoutButton

    const navigate = useNavigate();

    return (
        <div className="title-header2">
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li className="flex-row">
                    <img src="AlgorithmAlliesLogo.png" />
                    <h1>Algorithm Allies Team 6</h1>
                </li>
                <li className="showUser-parent">
                    {user &&  <p className="showUserInHomePage">Hi {user.email}</p>}
                </li>
                <li>
                    {!user && <Link to="/login">Login</Link>}
                    {user && <Button onClick={logoutButton}>Logout</Button>}
                </li>
            </ul>
        </div>
    )
};