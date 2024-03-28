import React, { useState } from 'react';
import { LoginProps } from './LoginProps';
import emailIcon from '../../images/iconMail.png';
import passwordIcon from '../../images/iconPassword.png';
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from '../contexts/userContext';
import { User } from '../../interfaces/User';
import { ServerLoginResponse } from '../../interfaces/ServerResponse';
import UserController from '../../controllers/UserController';

const Login: React.FC<LoginProps> = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [feedback, setFeedback] = useState('');
	const navigate = useNavigate();

	const { setUser } = useUserContext();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const response = await UserController.loginUser(username, password);

		if (!response) {
			setFeedback(`Failed to login as ${username}.`);
			return;
		}

		if (response instanceof Response) {
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
					setFeedback("Internal Server Error, please try again later.");
			}

			return;
		}

		setFeedback('');
		setUser(response as User);
		navigate("/");
	};

	return (
		<div className="flex items-center justify-center min-h-screen pt-20">
			<div 
				className="w-full max-w-xs px-4 py-6 mx-auto bg-white rounded-xl
					sm:px-6 sm:py-8 md:max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-xl flex flex-col gap-4
          border-4 border-primary shadow-2xl shadow-black"
				style={{ boxShadow: '-10px 10px 30px 0 rgba(0, 0, 0, 0.1)' }}>
				<h3 className="text-xl font-bold text-center sm:text-2xl text-gray-700">Log in to your account</h3>
				<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
					<div className="flex items-center mt-4">
						<img src={emailIcon} alt="Email"
							className="mr-2 h-5 w-5 flex-shrink-0" />
						<input
							type="text"
							id="email"
							aria-label='email or username'
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
							className="mr-2 h-5 w-5 flex-shrink-0" />
						<input
							type="password"
							id="password"
							aria-label='password'
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
					<button type='submit'
						className='p-2 px-5 m-2 bg-primary hover:bg-secondary
							text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
							text-base w-full'>
						Log In
					</button>
					</div>
					<div className="form-footer-container" style={{ marginTop: '5%' }}>
						<Link to="/signup" className="underline" style={{ textDecoration: 'underline' }}>Sign Up</Link>
						<a role="button" href="#" className="forgot-password text-sm text-primary hover:underline sm:text-base " style={{ display: 'flex', float: 'right' }}>
							Forgot password?
						</a>
					</div>
				</form>
			</div>
		</div>
	)
};

export default Login;