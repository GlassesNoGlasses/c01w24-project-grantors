import { NavbarProps } from './NavbarProps'
import { Link, useLocation, Outlet } from 'react-router-dom'
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
			<Link className='p-2 px-5 m-2 bg-primary hover:bg-secondary 
			text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
			text-base'
			to='/login'>
				Log In
			</Link>
		);
	};

	const SignUpButton = () => {
		return (
			<Link className='p-2 px-5 m-2 bg-secondary hover:bg-primary 
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
			to='/' onClick={LogOut}>
				Sign Out
			</Link>
		);
	};

	const AdminTopNaviation = (): JSX.Element =>  {
		return (
			<>
				<div className='flex items-center'>	
					<div className='hidden md:flex justify-end xl:text-[20px] text-[16px] xl:gap-20 xl:mr-16 
					mr-4 lg:gap-10 gap-6'>
						<Link className='hover:underline' to="/files">FileSys</Link>
						<Link className='hover:underline' to="/createGrant">Create Grants</Link>
						<a href='https://www.magnifyaccess.ai/about-us' 
						className='hover:underline' target='blank'>About Us</a>
						<a href='https://www.magnifyaccess.ai/additional-services' 
						className='hover:underline' target='blank'>Services</a>
						<a href='https://www.magnifyaccess.ai/contact-us' 
						className='hover:underline' target='blank'>Contact</a>
					</div>
					
					<div className='flex xl:gap-10 gap-4'>
						<div className='flex flex-row gap-4 items-center'>
							<p className='text-base font-bold'>{user?.username}</p>
							<SignOutButton />
						</div>
					</div>
				</ div>
			</>
		);
	};

	const ClientTopNavigation = (): JSX.Element =>  {
		return (
			<>	
				<div className='flex items-center'>	
					<div className='hidden md:flex justify-end xl:text-[20px] text-[16px] xl:gap-20 xl:mr-16 
					mr-6 lg:gap-10 gap-6'>
						<Link className='hover:underline' to="/files">FileSys</Link>
						<Link className='hover:underline' to="/grants">Grants</Link>
						<a href='https://www.magnifyaccess.ai/about-us' 
						className='hover:underline' target='blank'>About Us</a>
						<a href='https://www.magnifyaccess.ai/additional-services' 
						className='hover:underline' target='blank'>Services</a>
						<a href='https://www.magnifyaccess.ai/contact-us' 
						className='hover:underline' target='blank'>Contact</a>
					</div>
					
					<div className='flex xl:gap-10 gap-4'>
						<div className='flex flex-row gap-4 items-center'>
							<p className='text-base font-bold'>{user?.username}</p>
							<SignOutButton />
						</div>
					</div>
				</ div>
				
			</>
		);
	};

	const DefaultTopNavigation = (): JSX.Element => {
		return (
			<div className='flex items-center'>	
				<div className='hidden md:flex justify-end xl:text-[20px] text-[16px] xl:gap-20 xl:mr-16 
				mr-6 lg:gap-10 gap-6'>
					<a href='https://www.magnifyaccess.ai/about-us' 
					className='hover:underline' target='blank'>About Us</a>
					<a href='https://www.magnifyaccess.ai/additional-services' 
					className='hover:underline' target='blank'>Services</a>
					<a href='https://www.magnifyaccess.ai/contact-us' 
					className='hover:underline' target='blank'>Contact</a>
				</div>
				
				<div className='flex xl:gap-10 gap-4'>
					<LoginButton />
					<SignUpButton />
				</div>
			</ div>
		);
	};

	const SystemAdminTopNavigation = (): JSX.Element => {
		return (
			<div className='flex xl:gap-10 gap-4 items-center'>

				<div className='hidden md:flex justify-end xl:text-[20px] text-[16px] xl:gap-20 xl:mr-16 
					mr-4 lg:gap-10 gap-6'>
					<Link className='hover:underline' to="/users">View Users</Link>
					<Link className='hover:underline' to="/signup">Create New User</Link>
				</div>

				<div className='flex flex-row gap-4 items-center'>
					<p className='text-base font-bold'>{user?.username}</p>
					<SignOutButton />
				</div>
			</div>
		);
	};

	const SetTopNavigation = (): JSX.Element => {
		if (!user) {
			return DefaultTopNavigation();
		}

		return user.isSysAdmin ? (<SystemAdminTopNavigation />) : (user.isAdmin ? (<AdminTopNaviation/>) : (<ClientTopNavigation/>));
	};

	const Breadcrumbs = () => {
		const location = useLocation();
		const paths = location.pathname.split('/').filter(Boolean);
		const breadcrumbs = [{ path: '/', label: 'Home' }];	// Makes `Home` always visible in breadcrumbs by initializing it in the array
	
		paths.forEach((path, index) => {
			breadcrumbs.push({
				path: `/${paths.slice(0, index + 1).join('/')}`,
				label: path.charAt(0).toUpperCase() + path.slice(1)
			});
		});
	
		return (
			<div className="nav-breadcrumbs flex items-end">
				{breadcrumbs.map(({ path, label }, index) => (
					<div key={index}>
						<Link to={path} className="breadcrumb-link text-sm text-secondary hover:underline sm:text-base mx-1">
							{label}
						</Link>
						{index !== breadcrumbs.length - 1 && <span className="breadcrumb-separator">{'>'}</span>}
					</div>
				))}
			</div>
		);
	};

	return (
        <div>
			<div className='flex flex-col fixed top-0 w-[100vw] h-fit bg-white border-b-2 border-black'>
				<nav className='flex flex-col sm:flex-row justify-between items-center lg:pr-8 
				 bg-white w-full'>

					<div className='flex items-end'>
						<Link to="/" className='nav-brand'>
							<img src={logoImage} alt='grantors logo' 
							className='lg:h-[60px] h-[40px] lg:w-[200px] w-[120px] mt-2 mb-2 ml-4'/>
						</ Link>
						<p className='mb-4 text-md font-bold ml-2'>By</p>
						<a href="https://www.magnifyaccess.ai/" target='blank'>
							<img src={MAlogoImage} alt='grantors logo' 
							className='lg:h-[40px] lg:w-[81px] h-[32px] w-[64px] mt-2 mb-2 ml-1'/>
						</a>
					</ div>

					
					{SetTopNavigation()}
				</nav>
				<div className='pl-5 text-sm -mt-3'>
					<Breadcrumbs />
				</div>
			</div>
			<Outlet />
        </div>
    );
};

export default Navbar
