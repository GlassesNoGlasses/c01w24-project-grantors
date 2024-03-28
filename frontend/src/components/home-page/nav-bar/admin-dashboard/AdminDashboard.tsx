import React, { useEffect, useState } from 'react'
import { AdminDashboardProps } from './AdminDashboardProps'
import { useUserContext } from '../../../contexts/userContext'
import ButtonIcon from '../../../displays/ButtonIcon/ButtonIcon';
import addIcon from '../../../../images/addIcon.svg'
import logoutIcon from '../../../../images/logout.svg'
import userIcon from '../../../../images/user.svg'
import settingsIcon from '../../../../images/settings.svg'
import ApplicationIcon from '../../../displays/ApplicationIcon/ApplicationIcon';
import list from '../../../../images/list.png'
import search from '../../../../images/search.png'
import { Link } from 'react-router-dom';
import UserController from '../../../../controllers/UserController';
import { Cog6ToothIcon, ArrowRightStartOnRectangleIcon, FolderPlusIcon, ListBulletIcon, TrophyIcon, DocumentMagnifyingGlassIcon, ChartBarIcon, InboxIcon} from '@heroicons/react/24/solid';

const AdminDashboard = ({

  }: AdminDashboardProps) => {

    // States used
    const {user, setUser} = useUserContext();
    const [encodedOrg, setEncodedOrg] = useState('');

	useEffect(() => {
		if (user?.organization) {
			return setEncodedOrg(encodeURIComponent(user.organization));
		} else {
			return setEncodedOrg('');
		}
	}, [user]);

	const logout = () => {
		UserController.logoutUser();
		setUser(null);
	}

	return (
		<div className='h-full flex flex-col py-20'>
			
			<div className='bg-white pb-8 flex justify-between'>
				<h2 className='text-6xl text-secondary pl-10 w-fit flex items-center flex-col'>
					Welcome, {user?.username}!
					<div className='bg-primary h-[8px] -mt-4 w-[105%]'/>
				</h2>
				<Link to='/messages'>
					<ButtonIcon heroicon={<InboxIcon/>} label={"Messages"} text={user?.preferences.hc ? 'text-white' : 'text-black'}/>
				</Link>
			</div>
			
				
			<div className='flex justify-evenly items-center py-10'>
				<div>
					<Link to='/createGrant'>
						<ButtonIcon heroicon={<FolderPlusIcon/>} label={"New Grant"} text={user?.preferences.hc ? 'text-white' : 'text-black'}/>
					</ Link>
				</div>
				<Link to='/milestones'>
					<ButtonIcon heroicon={<TrophyIcon/>} label={"Milestones"} text={user?.preferences.hc ? 'text-white' : 'text-black'}/>
				</Link>
				<ButtonIcon heroicon={<ChartBarIcon />} label="Statistics" text={user?.preferences.hc ? 'text-white' : 'text-black'}/>
				<Link to='/settings'>
					<ButtonIcon heroicon={<Cog6ToothIcon/>} label={"Settings"} text={user?.preferences.hc ? 'text-white' : 'text-black'}/>
				</Link>
				<Link to="/">
					<ButtonIcon heroicon={<ArrowRightStartOnRectangleIcon/>} label={"Log Out"} callback={logout} text={user?.preferences.hc ? 'text-white' : 'text-black'}/>
				</Link>
			</div>

			<div className='flex justify-evenly items-center h-1/4 pt-[5vh]'>
				<Link to={`admin/grants`}>
				<ApplicationIcon
					heroicon={<ListBulletIcon className="h-40 w-40"/>}
					label="Grants You Created" />
				</Link>
				<Link to={`${encodedOrg}/applications`}>
					<ApplicationIcon heroicon={<DocumentMagnifyingGlassIcon className="h-40 w-40"/>} label={"Review Applications"}/>
				</Link>
			</div>
		</div>
	);
};

export default AdminDashboard

