import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Button } from 'react-bootstrap';

export const NavBar = () => {
    const [user, setUser] = useContext(AuthContext).user;
    const logoutButton = useContext(AuthContext).logoutButton
    const [isAdmin, setIsAdmin] = useContext(AuthContext).isAdmin

    const navigate = useNavigate();

    const testing = () => {
        console.log(isAdmin)
    }

    const linkStyle = {
        textDecoration: 'underline',
        textDecorationColor: '#333', // Change the color to match your design
        color: 'white',
    };

    const emphasizedLinkStyle = {
        ...linkStyle,
        fontSize: '20px', // Adjust the font size as needed
        fontWeight: 'bold', // Optional: Add bold font weight
      };
    
      return (
        <div style={{ position: 'relative', paddingBottom: '2%', paddingTop: '2%' }}>
            <ul style={{ position: 'fixed', top: 0, left: 0, width: '100%', display: 'flex', justifyContent: 'center', listStyle: 'none', padding: 0, alignItems: 'center', margin: 0, borderBottom: '2px solid #333', backgroundColor: '#333' }}>
                <li style={{ textAlign: 'center', padding: '20px' }}>
                    <Link to="/" style={emphasizedLinkStyle}>
                        Home
                    </Link>
                    </li>
            
                    {isAdmin && (
                    <li style={{ textAlign: 'center', padding: '20px' }}>
                        <Link to="/admin" style={emphasizedLinkStyle}>
                        Admin
                        </Link>
                    </li>
                    )}
            
                    <li style={{ textAlign: 'center', padding: '20px', display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <img src="AlgorithmAlliesLogo.png" alt="Logo" style={{ maxWidth: '100%', maxHeight: '50px' }} />
                    <h1 style={{ margin: '0', marginLeft: '10px', color: '#fff', fontSize: '35px' }}>
                        Algorithm Allies Team 6
                    </h1>
                    </li>
            
                    <li style={{ textAlign: 'center', padding: '20px' }}>
                    {user && <p style={{ textDecoration: 'underline', textDecorationColor: '#fff', color: '#fff', marginBottom: '10px' }}>Hi {user.email}</p>}
                    </li>
            
                    <li style={{ textAlign: 'center', padding: '20px' }}>
                    {!user && (
                        <Link to="/login" style={linkStyle}>
                        Login
                        </Link>
                    )}
                    {user && (
                        <Button onClick={logoutButton} style={{ color: '#fff' }}>
                        Logout
                        </Button>
                    )}
                </li>
            </ul>
        </div>
    )
};