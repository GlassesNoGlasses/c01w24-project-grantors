import React from 'react'
import { useUserContext } from '../contexts/userContext'
import UserController from '../../controllers/UserController';
import { Link } from 'react-router-dom';

const Settings = () => {

    const { user, setUser } = useUserContext()

    const LogOut = () => {
		setUser(null);
		UserController.logoutUser();
	};

    const SignOutButton = () => {
		return (
			<Link className='p-2 px-5 m-2 bg-red-500 hover:bg-red-700 active:bg-red-700
			text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
			text-base'
			to='/' onClick={LogOut}>
				Sign Out
			</Link>
		);
	};

    const HomeButton = () => {
		return (
			<Link className='p-2 px-5 m-2 bg-primary hover:bg-secondary
			text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
			text-base text-center'
			to='/'>
				Home
			</Link>
		);
	};

    const SettingStyle = 'bg-white w-[40vw] h-[80vh] border-4 border-primary shadow-2xl \
                    shadow-black rounded-xl flex flex-col p-4 justify-between items-center'

    interface AttributeProps {
        attribute: string,
        value: any
    }

    const Attribute: React.FC<AttributeProps> = ({attribute, value}) => {
        return(
        <div className='flex gap-4 mb-4 items-end'>
            <h2 className='font-semibold text-lg'>{attribute}: </h2>
            <p className='text-lg'>{value}</p>
        </div>)
    }

    return (
        <div className='pt-24'>
            <div className='flex justify-around'>
                <div className={`${SettingStyle}`}>
                    <h1 className='text-center font-bold text-2xl'>Account Information</h1>

                    <div className='mt-6 flex flex-col gpa6'>
                        <Attribute attribute='Full Name' value={user?.firstName + ' ' + user?.lastName}></Attribute>
                        <Attribute attribute='Username' value={user?.username}></Attribute>
                        <Attribute attribute='Email' value={user?.email}></Attribute>
                        {user?.isAdmin ? <Attribute attribute='Account Type' value={'admin'}></Attribute> : 
                        <Attribute attribute='Account Type' value={'applicant'}></Attribute>}
                        {user?.isAdmin ? <Attribute attribute='Organization' value={user?.organization}></Attribute> : <></>}
                    </div>
                    
                    <div className='flex flex-col justify-center gap-2'>
                        <HomeButton />
                        <SignOutButton/>
                    </div>
                    
                </div>

                <div className={`${SettingStyle}`}>
                    <h1 className='text-center font-bold text-2xl'>Accessibility</h1>
                </div>
            </div>
        </div>
    )

}

export default Settings

function setUser(arg0: null) {
    throw new Error('Function not implemented.');
}
