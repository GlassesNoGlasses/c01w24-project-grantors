import React, { useEffect } from 'react'
import { useUserContext } from '../contexts/userContext'
import UserController from '../../controllers/UserController';
import { Link } from 'react-router-dom';
import chrome from '../../images/chrome.png'
import firefox from '../../images/firefox.png'
import edge from '../../images/edge.png'
import safari from '../../images/safari.png'

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
			text-base text-center'
			to='/' onClick={LogOut}>
				Log Out
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

    const SettingStyle = 'bg-white min-w-[40vw] min-h-[80vh] border-4 border-primary shadow-2xl \
                    shadow-black rounded-xl flex flex-col p-4 justify-between items-center'

    interface AttributeProps {
        attribute: string,
        value: any
    }

    interface ExtensionProps {
        image: any,
        browser: string,
        link: string
    }

    const Attribute: React.FC<AttributeProps> = ({attribute, value}) => {
        return(
        <div className='flex gap-4 mb-4 items-end'>
            <h2 className='font-semibold text-lg'>{attribute}: </h2>
            <p className='text-lg'>{value}</p>
        </div>)
    }

    const Extension: React.FC<ExtensionProps> = ({ image, browser, link}) => {
        return(
                <a href={link} target='blank' className='flex items-center gap-2 border-[3px] p-1 px-3 rounded-xl 
                border-secondary hover:border-black font-semibold shadow-md shadow-black'>
                    <img src={image} alt={browser} className='h-8 w-8'/>
                    {browser}
                </a>
        )
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
                    
                    <div className='flex flex-col justify-center gap-2 w-[250px]'>
                        <HomeButton />
                        <SignOutButton/>
                    </div>
                    
                </div>

                <div className={`${SettingStyle}`}>
                    <h1 className='text-center font-bold text-2xl'>Accessibility</h1>

                    <div className='flex flex-col items-start gap-10'>

                    
                        <div className='flex flex-col'>
                            <h2 className='font-semibold mb-2 text-[1.2rem]'>Physical</h2>
                            <div>Our website supports nagivation between components with intuitive Tab Controls
                                <ul className='flex flex-col ml-4'>
                                    <li>
                                        - press <b className='underline'>TAB</b> to navigate to next component
                                    </li>
                                    <li>
                                        - press <b className='underline'>SHIFT + TAB</b> to nagivate to previous component
                                    </li>
                                    <li>
                                        - once on selected component, press <b className='underline'>ENTER</b> to proceed
                                    </li>
                                </ul>
                            </div>
                        </div>

                        
                        <div className='flex flex-col'>
                            <h2 className='font-semibold mb-2 text-[1.2rem]'>Visual</h2>
                            <div>Font and View can be resized on command with browser support
                                <ul className='flex flex-col ml-4'>
                                    <li>
                                        - press <b className='underline'>CTRL + '+'</b> to zoom in (replace <b className='underline'>CTRL</b> with <b className='underline'>COMMAND</b> for Mac)
                                    </li>
                                    <li>
                                        - press <b className='underline'>CTRL + '-'</b> to zoom out (replace <b className='underline'>CTRL</b> with <b className='underline'>COMMAND</b> for Mac)
                                    </li>
                            
                                </ul>
                            </div>
                        </div>
                        

                        <div className='mb-20'>
                            Auditory
                            
                        </div>
                    </div>

                    <div className='w-full'>
                        <h2 className='font-semibold text-center mb-4'>
                            For more accessibility features, try installing browser extensions:
                        </h2>
                        <div className='flex justify-around'>
                            <Extension image={chrome} browser='Chrome' link='https://chromewebstore.google.com/collection/3p_accessibility_extensions'/>
                            <Extension image={firefox} browser='Firefox' link='https://addons.mozilla.org/en-CA/firefox/extensions/'/>
                            <Extension image={edge} browser='Microsoft Edge' link='https://microsoftedge.microsoft.com/addons/category/Accessibility'/>
                            <Extension image={safari} browser='Safari' link='https://support.apple.com/en-ca/102343'/>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )

}

export default Settings

function setUser(arg0: null) {
    throw new Error('Function not implemented.');
}
