import React, { useState } from 'react';
import { LoginProps } from './LoginProps';
import './Login.css';
import emailIcon from '../../images/iconMail.png';
import passwordIcon from '../../images/iconPassword.png';

const SERVER_PORT:number = 8000;

const Login: React.FC<LoginProps> = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      const response = await fetch(`http://localhost:${SERVER_PORT}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password }),
      });
  
      switch (response.status) {
        case 404:
          console.log("User Not Found")
          break;
        case 400:
          console.log("Missing Required Fields")
          break;
        case 401:
          console.log("Incorrect Credentials")
          break;
        case 500:
          throw new Error('Failed to login');
        case 200:
          console.log('Login successful');
          break;
      }
      
    } catch (error) {
      console.error('Login failed:', (error as Error).message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h3 className="title">Log in to your account</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <img src={emailIcon} alt="Email" className="input-icon" />
            <input
              type="text"
              id="email"
              placeholder="Enter email or username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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