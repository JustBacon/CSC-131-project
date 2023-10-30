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

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log(userCredential);
      const user = userCredential.user;
      localStorage.setItem('token', user.accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      // Clear the email and password fields
      setEmail('');
      setPassword('');
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
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
          <Button variant="secondary" type="submit" className='signup-button'>Signup</Button>
        </form>
        <p>Need to Login? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};
