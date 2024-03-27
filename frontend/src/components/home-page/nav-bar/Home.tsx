import DefaultPage from './default-page/DefaultPage';
import AdminDashboard from './admin-dashboard/AdminDashboard';
import ClientDashboard from './client-dashboard/ClientDashboard';
import { useUserContext } from '../../contexts/userContext';
import { HomeProps } from './HomeProps';
import SystemAdminDashboard from './system-admin-dashboard/SystemAdminDashboard';

const Home = ({}: HomeProps) => {
	// SECTION: States Used
	const {user} = useUserContext();

	// SECTION: Render Functions
	const RenderHomepage = () => {
		if (!user) {
			return (<DefaultPage/>);
		}	

		return user.isSysAdmin ? (<SystemAdminDashboard/>) : (user.isAdmin ? (<AdminDashboard/>) : (<ClientDashboard/>));
	};

	return (
		<div className='h-full w-full'>
			{RenderHomepage()}
		</div>
	);
};

export default Home