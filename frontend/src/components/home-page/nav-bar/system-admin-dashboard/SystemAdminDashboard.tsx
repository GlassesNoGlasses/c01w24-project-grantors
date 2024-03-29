import React from 'react'
import { useUserContext } from '../../../contexts/userContext'
import { Link } from 'react-router-dom'
import { UserPlusIcon, UsersIcon, Cog6ToothIcon, ArrowRightStartOnRectangleIcon, ListBulletIcon } from '@heroicons/react/24/solid'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import ButtonIcon from '../../../displays/ButtonIcon/ButtonIcon'
import UserController from '../../../../controllers/UserController'
import ApplicationIcon from '../../../displays/ApplicationIcon/ApplicationIcon'

const SystemAdminDashboard = () => {

    const { user, setUser } = useUserContext()

    const logout = () => {
		setUser(null);
		UserController.logoutUser();
	}

    return (
        <div className="dashboard-container w-full h-full">

			<div className='bg-white pb-8'>
				<h2 className='text-6xl text-secondary pl-10 w-fit flex items-center flex-col'>
					Welcome, {user?.username}!
					<div className='bg-primary h-[8px] -mt-4 w-[105%]'/>
				</h2>
			</div>

            <div className="client-butons flex justify-evenly items-center py-10">
				<Link to="/users">
					<ButtonIcon heroicon={<UsersIcon />} label="View Users" text={user?.preferences.hc ? 'text-white' : 'text-black'}/>
				</Link>
				<Link to="/newUser">
					<ButtonIcon heroicon={<UserPlusIcon />} label="Create User" text={user?.preferences.hc ? 'text-white' : 'text-black'}/>
				</Link>
				<Link to='/settings'>
					<ButtonIcon heroicon={<Cog6ToothIcon/>} label={"Settings"} text={user?.preferences.hc ? 'text-white' : 'text-black'}/>
				</Link>
				<Link to="/">
					<ButtonIcon heroicon={<ArrowRightStartOnRectangleIcon />} label="Log out" callback={logout} text={user?.preferences.hc ? 'text-white' : 'text-black'}/>
				</Link>
			</div>

            <div className="application-buttons flex justify-evenly items-center h-1/4 pt-[5vh]">
				<Link to="/grants">
					<ApplicationIcon
					heroicon={<ListBulletIcon className="h-40 w-40"/>}
					label="View All Grants" />
				</Link>
				<a href="https://www.magnifyaccess.ai/" target='_blank'>
					<ApplicationIcon heroicon={<GlobeAltIcon className="h-40 w-40"/>} label="Magnify Access" />
				</a>
			</div>
			
		</div>
    )
}

export default SystemAdminDashboard