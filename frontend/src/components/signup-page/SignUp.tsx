import React, { useState } from 'react';
import { SignUpProps } from './SignUpProps';
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div 
        className="w-full max-w-xs px-4 py-6 mx-auto bg-white shadow rounded-lg 
          sm:px-6 sm:py-8 md:max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-xl
          flex flex-col gap-4"
        style={{ boxShadow: '-10px 10px 30px 0 rgba(0, 0, 0, 0.1)' }}>
        <h3 className="text-xl font-bold text-center sm:text-2xl text-gray-700">Sign up to Grantors</h3>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <div className="flex items-center">
            <img src={nameIcon} alt="Password"
              className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
            <input
              type="firstName"
              id="firstName"
              placeholder="Enter your First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 mt-2 border border-gray-200 rounded-full focus:outline-none
                focus:ring focus:ring-green-600 sm:px-4 sm:py-3"
              style={{ boxShadow: 'inset -4px 4px 6px rgba(0, 0, 0, 0.1)'}}
              required
            />
          </div>
          <div className="flex items-center">
            <img src={nameIcon} alt="Password"
              className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
            <input
              type="lastName"
              id="lastName"
              placeholder="Enter your Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 mt-2 border border-gray-200 rounded-full focus:outline-none
                focus:ring focus:ring-green-600 sm:px-4 sm:py-3"
              style={{ boxShadow: 'inset -4px 4px 6px rgba(0, 0, 0, 0.1)'}}
              required
            />
          </div>
          <div className="flex items-center">
            <img src={emailIcon} alt="Email"
              className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
            <input
              type="text"
              id="email"
              placeholder="Enter Email or Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-2 border border-gray-200 rounded-full focus:outline-none
                focus:ring focus:ring-green-600 sm:px-4 sm:py-3"
              style={{ boxShadow: 'inset -4px 4px 6px rgba(0, 0, 0, 0.1)'}}
              required
            />
          </div>
          <div className="flex items-center">
            <img src={passwordIcon} alt="Password"
              className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-2 border border-gray-200 rounded-full focus:outline-none
                focus:ring focus:ring-green-600 sm:px-4 sm:py-3"
              style={{ boxShadow: 'inset -4px 4px 6px rgba(0, 0, 0, 0.1)'}}
              required
            />
          </div>
          <label className='flex flex-row gap-2 text-blue-700 text-sm'>
            Sign up as Admin?
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={() => setIsAdmin(!isAdmin)}
            />
          </label>
          <div className="flex justify-center">
            <button
              type="submit" 
              className='p-2 px-5 m-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700
              text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
                text-base'>Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
