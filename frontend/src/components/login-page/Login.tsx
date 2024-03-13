import React, { useState } from 'react';
import { LoginProps } from './LoginProps';
import emailIcon from '../../images/iconMail.png';
import passwordIcon from '../../images/iconPassword.png';
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from '../contexts/userContext';
import { User } from '../interfaces/User';
import { ServerLoginResponse } from '../interfaces/ServerLoginResponse';
import { SERVER_PORT } from '../../constants/ServerConstants'

const Login: React.FC<LoginProps> = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  const {user, setUser} = useUserContext();

  const InstantiateUser = (response: ServerLoginResponse): User => {
    if (response.isAdmin) {
      return {accountID: response.accountID, isAdmin: true, username: response.username,
        firstName: response.firstName, lastName: response.lastName, email: response.email,
        organization: response.organization, authToken: response.authToken };
    }
    return {accountID: response.accountID, isAdmin: false, username: response.username, 
      firstName: response.firstName, lastName: response.lastName, email: response.email,
      authToken: response.authToken }
  };

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
          setFeedback("user does not exist, perhaps you would like to sign up?")
          break;
        case 400:
          setFeedback("Missing Required Fields")
          break;
        case 401:
          setFeedback("invalid credentials, please try again.")
          break;
        case 500:
          throw new Error('Failed to login');
        case 200:
          console.log('Login successful');
          await response.json().then((data) => {
            console.log(`Welcome ${data['username']}`);
            setFeedback('');
            setUser(InstantiateUser(data));
            navigate("/");
          });
          break;
      }
      
    } catch (error) {
      console.error('Login failed:', (error as Error).message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100" style={{ backgroundColor: 'rgb(141, 229, 100)' }}>
      <div 
        className="w-full max-w-xs px-4 py-6 mx-auto bg-white shadow rounded-lg 
          sm:px-6 sm:py-8 md:max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-xl flex flex-col gap-4"
        style={{ boxShadow: '-10px 10px 30px 0 rgba(0, 0, 0, 0.1)' }}>
        <h3 className="text-xl font-bold text-center sm:text-2xl text-gray-700">Log in to your account</h3>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <div className="flex items-center mt-4">
            <img src={emailIcon} alt="Email"
              className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
            <input
              type="text"
              id="email"
              placeholder="Enter email or username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input w-full px-3 py-2 mt-2 border border-gray-200 rounded-full focus:outline-none
                focus:ring focus:ring-green-600 sm:px-4 sm:py-3"
              style={{ boxShadow: 'inset -4px 4px 6px rgba(0, 0, 0, 0.1)' }}
              required
            />
          </div>
          <div className="flex items-center mt-4">
            <img src={passwordIcon} alt="Password"
              className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input w-full px-3 py-2 mt-2 border border-gray-200 rounded-full focus:outline-none
                focus:ring focus:ring-green-600 sm:px-4 sm:py-3"
              style={{ boxShadow: 'inset -4px 4px 6px rgba(0, 0, 0, 0.1)' }}
              required
            />
          </div>
          <div className="feedback-container" style={{ height: '2.5vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <span className="input-feedback" style={{ color: 'red' }}>{feedback}</span>
          </div>
          <div className="flex justify-center">
            <button
              type="submit" 
              className="submit-btn px-4 py-2 mt-4 text-white bg-green-500 rounded-lg hover:bg-green-600 sm:px-6 sm:py-3"
              style={{ width: '100%' }}>Login</button>
          </div>
          <div className="form-footer-container" style={{ marginTop: '5%' }}>
            <Link to="/signup" className="underline" style={{ textDecoration: 'underline' }}>Sign Up</Link>
            <a href="#" className="forgot-password text-sm text-green-500 hover:underline sm:text-base" style={{ display: 'flex', float: 'right', color: 'rgb(34, 197, 94)' }}>Forgot password?</a>
          </div>
        </form>
      </div>
    </div>
    )
};

export default Login;