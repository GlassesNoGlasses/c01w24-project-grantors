import { useUserContext } from '../../../contexts/userContext';
import ButtonIcon from '../../../displays/ButtonIcon/ButtonIcon';
import { Cog6ToothIcon, ArrowRightStartOnRectangleIcon, UserIcon, StarIcon, ListBulletIcon, TrophyIcon} from '@heroicons/react/24/solid';
import search from '../../../../images/search.png'
import ApplicationIcon from '../../../displays/ApplicationIcon/ApplicationIcon';
import { Link } from 'react-router-dom';
import { ClientDashboardProps } from './ClientDashboardProps';
import UserController from '../../../../controllers/UserController';


const ClientDashboard = ({}: ClientDashboardProps) => {
	const {user, setUser} = useUserContext();

	const logout = () => {
		setUser(null);
		UserController.logoutUser();
	}

	return (
		<div className="dashboard-container py-20 w-full h-full">

			<div className='bg-white pb-8'>
				<h2 className='text-6xl text-secondary pl-10 w-fit flex items-center flex-col'>
					Welcome, {user?.username}!
					<div className='bg-primary h-[8px] -mt-4 w-[105%]'/>
				</h2>
			</div>

			<div className="client-butons flex justify-evenly items-center py-10">
				<Link to="/saved">
					<ButtonIcon heroicon={<StarIcon />} label="Saved Grants"/>
				</Link>
				<ButtonIcon heroicon={<TrophyIcon />} label="Milestones"/>
				<ButtonIcon heroicon={<Cog6ToothIcon className=""/>} label="Settings"/>
				<Link to="/">
					<ButtonIcon heroicon={<ArrowRightStartOnRectangleIcon />} label="Log out" callback={logout}/>
				</Link>
			</div>
			<div className="application-buttons flex justify-evenly items-center h-1/4 pt-[5vh]">
				<Link to="/grants">
					<ApplicationIcon
					heroicon={<ListBulletIcon className="h-40 w-40"/>}
					label="View Available Grants" />
				</Link>
				<Link to="/applications">
					<ApplicationIcon imageSrc={search} label="My Applications" />
				</Link>
			</div>
		</div>
	);
};

export default ClientDashboard