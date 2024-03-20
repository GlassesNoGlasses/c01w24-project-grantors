import { NavbarProps } from './NavbarProps'
import { Link, Outlet } from 'react-router-dom'
import logoImage from '../../images/logo.png'
import MAlogoImage from '../../images/ma-logo.png'
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
			<Link className='p-2 px-5 m-2 bg-primary hover:bg-secondary active:bg-green-700
			text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
			text-base'
			to='/login'>
				Log In
			</Link>
		);
	};

	const SignUpButton = () => {
		return (
			<Link className='p-2 px-5 m-2 bg-secondary hover:bg-primary active:bg-blue-700
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
				<Link className='text-base hover:underline' to="/about">About Us</Link>
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
				<Link className='text-base hover:underline' to="/about">About Us</Link>
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
			<div className='flex items-center'>	
				<div className='flex justify-end gap-20 mr-16'>
					<Link className='text-base hover:underline' to="/about">About Us</Link>
					<Link className='text-base hover:underline' to="/services">Services</Link>
					<Link className='text-base hover:underline' to="/gallery">Gallery</Link>
					<Link className='text-base hover:underline' to="/contact">Contact</Link>
				</div>
				
				<div className='flex gap-10'>
					<LoginButton />
					<SignUpButton />
				</div>
			</ div>
		);
	};

	const SetTopNavigation = (): JSX.Element => {
		if (!user) {
			return DefaultTopNavigation();
		}

		return user.isAdmin ? AdminTopNaviation() : ClientTopNavigation();
	};

	return (
		<div className='h-full w-full bg-primary'>
			<nav className='flex flex-col sm:flex-row justify-between items-center sm:pr-8 
			border-b-2 border-black bg-white fixed top-0 w-full'>
			
				<div className='flex items-end'>
					<Link to="/" className='nav-brand'>
						<img src={logoImage} alt='grantors logo' className='h-[60px] mt-2 mb-2 ml-4'/>
					</ Link>
					<p className='mb-4 text-md font-bold ml-2'>By</p>
					<a href="https://www.magnifyaccess.ai/" target='blank'>
						<img src={MAlogoImage} alt='grantors logo' className='h-[40px] mt-2 mb-2 ml-1'/>
					</a>
				</ div>
			
				{SetTopNavigation()}
			</nav>
			<Outlet />
		</div>
	);
};

export default Navbar
