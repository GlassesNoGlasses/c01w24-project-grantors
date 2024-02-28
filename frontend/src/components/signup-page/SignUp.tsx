import React, { useState } from 'react';
import { SignUpProps } from './SignUpProps';
import './SignUp.css';
import emailIcon from '../../images/iconMail.png';
import passwordIcon from '../../images/iconPassword.png';

const SignUp: React.FC<SignUpProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      </div>
    </div>
  );
};

export default SignUp;