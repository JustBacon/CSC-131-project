import React, { useState } from 'react';
import { auth } from '../configuration/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/App.css';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // add state for admin

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log(userCredential);
      const user = userCredential.user;

      // Make signup account admin
      if (isAdmin) {
        // Assign admin role
        await setCustomClaim(user, { admin: true });
      }

      localStorage.setItem('token', user.accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      setEmail('');
      setPassword('');
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const setCustomClaim = async (user, claims) => {
    // idk what to put here
  };

  return (
    <div>
      <div><h1 className="title-header">Algorithm Allies Team 6</h1></div>
      <div><h2 id="subtitle-name">Signup Page</h2></div>
      <div className="signup-page-content">
        <p className="general-div">Please enter your email and a password</p>
        <form onSubmit={handleSubmit} className='signup-form'>
          <div className="general-input-box">
            <input
              type="email"
              placeholder="Your Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="general-input-box">
            <input
              type="password"
              placeholder="Your Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="general-input-box">
            <label>
              Sign up as admin:
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={() => setIsAdmin(!isAdmin)}
              />
            </label>
          </div>
          <Button variant="secondary" type="submit" className='signup-button'>Signup</Button>
        </form>
        <p>Need to Login? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};
