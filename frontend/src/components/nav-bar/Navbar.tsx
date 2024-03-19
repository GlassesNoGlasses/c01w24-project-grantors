import { NavbarProps } from './NavbarProps'
import { Link, Outlet } from 'react-router-dom'
import logoImage from '../../images/grantors-logo.png'
import { useUserContext } from '../contexts/userContext'
import UserController from '../../controllers/UserController';

const Navbar = ({}: NavbarProps) => {
	// Get User Context
	const {user, setUser} = useUserContext();

	const LogOut = () => {
		setUser(null);
		UserController.logoutUser();
	};

	const LoginButton = () => {
		return (
			<Link className='p-2 px-5 m-2 bg-green-500 hover:bg-green-600 active:bg-green-700
			text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
			text-base'
			to='/login'>
				Log In
			</Link>
		);
	};

	const SignUpButton = () => {
		return (
			<Link className='p-2 px-5 m-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700
			text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
			text-base'
			to='/signup'>
				Sign Up
			</Link>
		);
	};

	const SignOutButton = () => {
		return (
			<Link className='p-2 px-5 m-2 bg-red-500 hover:bg-red-600 active:bg-red-700
			text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
			text-base'
			to='/'>
			<button onClick={LogOut}>Sign Out</button>
			</Link>
		);
	};

	const AdminTopNaviation = (): JSX.Element =>  {
		return (
			<>
				<Link className='text-base hover:underline' to="/createGrant">Create Grants</Link>
				<Link className='text-base hover:underline' to="/about">About</Link>
				<Link className='text-base hover:underline' to="/services">Services</Link>
				<Link className='text-base hover:underline' to="/gallery">Gallery</Link>
				<Link className='text-base hover:underline' to="/contact">Contact</Link>
				<div className='flex flex-row gap-4 items-center'>
					<p className='text-base'>{user?.username}</p>
					<SignOutButton />
				</div>
			</>
		);
	};

	const ClientTopNavigation = (): JSX.Element =>  {
		return (
			<>
				<Link className='text-base hover:underline' to="/">Grants</Link>
				<Link className='text-base hover:underline' to="/about">About</Link>
				<Link className='text-base hover:underline' to="/services">Services</Link>
				<Link className='text-base hover:underline' to="/gallery">Gallery</Link>
				<Link className='text-base hover:underline' to="/contact">Contact</Link>
				<div className='flex flex-row gap-4 items-center'>
					<p className='text-base'>{user?.username}</p>
					<SignOutButton />
				</div>
			</>
		);
	};

	const DefaultTopNavigation = (): JSX.Element => {
		return (
			<>
				<Link className='text-base hover:underline' to="/about">About</Link>
				<Link className='text-base hover:underline' to="/services">Services</Link>
				<Link className='text-base hover:underline' to="/gallery">Gallery</Link>
				<Link className='text-base hover:underline' to="/contact">Contact</Link>
				<LoginButton />
				<SignUpButton />
			</>
		);
	};

	const SetTopNavigation = (): JSX.Element => {
		if (!user) {
			return DefaultTopNavigation();
		}

		return user.isAdmin ? AdminTopNaviation() : ClientTopNavigation();
	};

	return (
		<div className='h-full w-full'>
			<nav className='flex flex-col sm:flex-row justify-between items-center sm:pr-8 border-b-2 border-black'>
			<Link to="/" className='nav-brand'>
				<img src={logoImage} alt='grantors logo' className='nav-logo'/>
			</Link>
			{SetTopNavigation()}
			</nav>
			<Outlet />
		</div>
	);
};

export default Navbar
