import React, { useState } from 'react';
import { SignUpProps } from './SignUpProps';
import nameIcon from '../../images/iconName.png';
import emailIcon from '../../images/iconMail.png';
import passwordIcon from '../../images/iconPassword.png';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { Modal } from '../modal/Modal';
import { useNavigate } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import { useUserContext } from '../contexts/userContext';
import { User } from '../../interfaces/User';

const ACCESS_CODE = 'CSCC01'

const SignUp: React.FC<SignUpProps> = ({adminCreate}) => {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isAdmin, setIsAdmin] = useState(false);
	const [isSysAdmin, setIsSysAdmin] = useState(false);
	const [organization, setOrganization] = useState('');
	const [code, setCode] = useState('')
	const [feedback, setFeedback] = useState<string>("");
	const [showModal, setShowModal] = useState<boolean>(false);

	const { setUser } = useUserContext();
	const navigate = useNavigate();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (isSysAdmin && code !== ACCESS_CODE) {
			setFeedback("Invalid Access Code")
			return;
		}

		const response = await UserController.signupUser(
			username, password, email, firstName, lastName, organization, isAdmin, isSysAdmin);

		if (!response) {
			setFeedback(`Failed to sign up as ${username}.`);
			return;
		}
		
		if (!response.ok) {
			setFeedback(`User already exists.`);
			return;
		}

		console.log('Sign up successful');
		setShowModal(true);
	};

	const login = async () => {
		const response = await UserController.loginUser(username, password);

		if (!response || response instanceof Response) {
			navigate('/login');
			return;
		}

		setUser(response as User);
		navigate('/');
	}

  return (
  	<div className='flex h-[85vh] items-center'>
    		<div className="w-full max-w-xs px-4 py-6 mx-auto bg-white rounded-xl 
				sm:px-6 sm:py-8 md:max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-xl
				flex flex-col gap-4 border-4 border-primary shadow-2xl shadow-black"
          		style={{ boxShadow: '-10px 10px 30px 0 rgba(0, 0, 0, 0.1)' }}>
				<h3 className="text-xl font-bold text-center sm:text-2xl text-gray-700">{adminCreate ?
				"Create an account for Grantors" : "Sign up for Grantors"}</h3>
				<form className='flex flex-col gap-4' onSubmit={handleSubmit} onChange={() => setFeedback('')}>
					<div className='flex flex-row'>
						<div className="flex items-center w-[49%] mr-[2%]">
							<img src={nameIcon} alt="Password"
								className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
							<input
								type="firstName"
								id="firstName"
								aria-label='first name'
								placeholder="Enter First Name"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								className="w-full px-3 py-2 mt-2 border border-gray-200 rounded-full focus:outline-none
								focus:ring focus:ring-green-600 sm:px-4 sm:py-3"
								style={{ boxShadow: 'inset -4px 4px 6px rgba(0, 0, 0, 0.1)'}}
								required
							/>
						</div>
						<div className="flex items-center w-[49%]">
							<input
								type="lastName"
								id="lastName"
								aria-label='last name'
								placeholder="Enter Last Name"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								className="w-full px-3 py-2 mt-2 border border-gray-200 rounded-full focus:outline-none
								focus:ring focus:ring-green-600 sm:px-4 sm:py-3"
								style={{ boxShadow: 'inset -4px 4px 6px rgba(0, 0, 0, 0.1)'}}
								required
							/>
						</div>
					</div>
					
					<div className="flex items-center">
						<img src={emailIcon} alt="Email"
							className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
						<input
							type="text"
							id="email"
							aria-label='email'
							placeholder="Enter Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-3 py-2 mt-2 border border-gray-200 rounded-full focus:outline-none
							focus:ring focus:ring-green-600 sm:px-4 sm:py-3"
							style={{ boxShadow: 'inset -4px 4px 6px rgba(0, 0, 0, 0.1)'}}
							required
						/>
					</div>
					<div className="flex items-center">
						<img src={nameIcon} alt="Username"
							className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
						<input
							type="text"
							id="username"
							aria-label='username'
							placeholder="Enter Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
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
							aria-label='password'
							placeholder="Enter Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-3 py-2 mt-2 border border-gray-200 rounded-full focus:outline-none
							focus:ring focus:ring-green-600 sm:px-4 sm:py-3"
							style={{ boxShadow: 'inset -4px 4px 6px rgba(0, 0, 0, 0.1)'}}
							required
						/>
					</div>
					{ isAdmin ?
						<div className="flex items-center">
							<BuildingOfficeIcon className="mr-2 h-5 w-5 flex-shrink-0" />
							<input
							type="text"
							id="organization"
							aria-label='organization'
							placeholder="Enter Organization"
							value={organization}
							onChange={(e) => setOrganization(e.target.value)}
							className="w-full px-3 py-2 mt-2 border border-gray-200 rounded-full focus:outline-none
								focus:ring focus:ring-green-600 sm:px-4 sm:py-3"
							style={{ boxShadow: 'inset -4px 4px 6px rgba(0, 0, 0, 0.1)'}}
							required
							/>
						</div>
						: null
					}
					{ isSysAdmin ?
						<div className="flex items-center">
							<BuildingOfficeIcon className="mr-2 h-5 w-5 flex-shrink-0" />
							<input
							type="text"
							id="organization"
							placeholder="Enter Access Code: CSCC01"
							value={code}
							onChange={(e) => setCode(e.target.value)}
							className="w-full px-3 py-2 mt-2 border border-gray-200 rounded-full focus:outline-none
								focus:ring focus:ring-green-600 sm:px-4 sm:py-3"
							style={{ boxShadow: 'inset -4px 4px 6px rgba(0, 0, 0, 0.1)'}}
							required
							/>
						</div>
						: <label className='flex flex-row gap-2 text-primary text-sm ml-2'>
						Sign up as Grantor?
						<input
							type="checkbox"
							checked={isAdmin}
							onChange={() => setIsAdmin(!isAdmin)}
						/>
					</label>
					}
					
					{ !isAdmin ?
						<label className='flex flex-row gap-2 text-primary text-sm ml-2'>
						Sign up as Admin?
						<input
							type="checkbox"
							checked={isSysAdmin}
							onChange={() => setIsSysAdmin(!isSysAdmin)}
						/>
						</label>
						: null
					}
					
					
					<div className="flex justify-center">
						<button
							type="submit" 
							className='p-2 px-5 m-2 bg-secondary hover:bg-primary w-full
							text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
							text-base'>Sign Up</button>
					</div>
				</form>
				<div className='flex items-center justify-center'>
					<span className='font-bold text-red-500 h-5'>{feedback}</span>
				</div>
			
		</div>
		{adminCreate?
		<Modal showModal={showModal} closeModal={() => setShowModal(false)} openModal={() => setShowModal(true)}>
			<div className='flex h-[100vh] w-[100vw] justify-center items-center'>
				<div className='bg-white h-fit w-2/5 border-4 border-blue-400 border-solid rounded-lg'>
					<p className='text-2xl text-center font-bold border-b-2 border-solid border-black'>
						Account Created!
					</p>
					<div className='h-full w-full'>
						<p className='text-xl text-center font-semibold'>
							{`You have successfully created an acccount as ${username} with the email ${email}.`}
						</p>
						<p className='text-xl text-center font-normal'>
							Press "Esc" or click "Close" below to continue where you left off.
						</p>
						<div className='flex justify-center'>
							<button className='p-2 px-5 m-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700
								text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
								text-base text-center justify-center align-middle flex pb-1'
								onClick={() => setShowModal(false)}>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
		</Modal> : 
		<Modal showModal={showModal} closeModal={() => setShowModal(false)} openModal={() => setShowModal(true)}>
			<div className='flex h-[100vh] w-[100vw] justify-center items-center' role="dialog" aria-modal="true" tabIndex={0}>
				<div className='bg-white h-fit w-2/5 border-4 border-blue-400 border-solid rounded-lg'>
					<h1 className='text-2xl text-center font-bold border-b-2 border-solid border-black'>
						Thank you for signing up to Grantors!
					</h1>
					<div className='h-full w-full'>
						<p className='text-xl text-center font-semibold'>
							{`You have successfully signed up as ${username} with the email ${email}.`}
						</p>
						<p className='text-xl text-center font-medium'>
							To log in with your new account, click the "Login" button below.
						</p>
						<p className='text-xl text-center font-normal'>
							Otherwise, press "Esc" or click "Close" below to continue where you left off.
						</p>
						<div className='flex flex-row justify-between'>
							<button className='p-2 px-5 m-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700
								text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
								text-base text-center justify-center align-middle flex pb-1'
								onClick={() => setShowModal(false)}>
								Close
							</button>
							<button className='p-2 px-5 m-2 bg-green-500 hover:bg-green-600 active:bg-green-700
								text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
								text-base text-center justify-center align-middle'
								onClick={login}>
								Log In
							</button>
						</div>
					</div>
				</div>
			</div>
		</Modal>
}
    </div>
  );
};

export default SignUp;
