import React, { useState } from 'react';
import { SignUpProps } from './SignUpProps';
import './SignUp.css';
import nameIcon from '../../images/iconName.png';
import emailIcon from '../../images/iconMail.png';
import passwordIcon from '../../images/iconPassword.png';

const SignUp: React.FC<SignUpProps> = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      const response = await fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to sign up');
      }
      console.log('Sign up successful');
    } catch (error) {
      console.error('Sign up failed:', (error as Error).message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h3 className="title">Sign up to Grantors</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <img src={nameIcon} alt="Password" className="input-icon" />
            <input
              type="firstName"
              id="firstName"
              placeholder="Enter your First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="input-group">
            <img src={nameIcon} alt="Password" className="input-icon" />
            <input
              type="lastName"
              id="lastName"
              placeholder="Enter your Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="input-group">
            <img src={emailIcon} alt="Email" className="input-icon" />
            <input
              type="text"
              id="email"
              placeholder="Enter Email or Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="input-group">
            <img src={passwordIcon} alt="Password" className="input-icon" />
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="flex justify-center">
            <button type="submit" className="submit-btn">Sign Up</button>
          </div>
        </form>
        <div className="is-admin-button">
          <label>
            Sign up as Admin?
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={() => setIsAdmin(!isAdmin)}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
