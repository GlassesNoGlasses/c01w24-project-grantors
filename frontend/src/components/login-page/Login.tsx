import React, { useState } from 'react';
import { LoginProps } from './LoginProps';
import './Login.css';
import emailIcon from '../../images/iconMail.png';
import passwordIcon from '../../images/iconPassword.png';

const Login: React.FC<LoginProps> = ({ errorMessage }) => { // Correctly destructure the props here
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to login');
      }
      console.log('Login successful');
    } catch (error) {
      console.error('Login failed:', (error as Error).message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h3 className="title">Log in to your account</h3>
        {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display the error message if it exists */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <img src={emailIcon} alt="Email" className="input-icon" />
            <input
              type="text"
              id="email"
              placeholder="Enter email or username"
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
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="flex items-baseline justify-between">
            <button type="submit" className="submit-btn">Login</button>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;