import React, { useEffect, useState } from 'react'
import { useUserContext } from '../contexts/userContext'
import UserController from '../../controllers/UserController';
import { Link } from 'react-router-dom';
import chrome from '../../images/chrome.png'
import firefox from '../../images/firefox.png'
import edge from '../../images/edge.png'
import safari from '../../images/safari.png'


const SERVER_PORT = 8000


const Settings = () => {
    
    const { user, setUser } = useUserContext()

    const [checker, setChecker] = useState([false, false])

    useEffect(() => {
        if (user) {
        setChecker([user.preferences.sbg, user.preferences.hc]);
        }
    }, [user]);
    
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

    const SettingStyle = 'bg-white min-w-[40vw] min-h-[60vh] border-4 border-primary shadow-2xl \
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
                <a role="button" href={link} target='blank' className='flex items-center gap-2 border-[3px] p-1 px-3 rounded-xl 
                border-secondary hover:border-black font-semibold shadow-md shadow-black'>
                    <img src={image} alt={browser} className='h-8 w-8'/>
                    {browser}
                </a>
        )
    }

    const preferenceHandler = async (preference: number) => {
        try {
            // Ensure user is defined
            if (!user) return;
    
            // Prepare the preference body based on the preference number
            let preferenceBody = {
                "preferences" : {
                    "sbg": preference === 0 ? !checker[0] : checker[0],
                    "hc": preference === 1 ? !checker[1] : checker[1],
                }
            };
            
            setChecker([preferenceBody.preferences.sbg, preferenceBody.preferences.hc])
    
            const res = await UserController.updatePreference(user.accountID, preferenceBody)
            
            if (res) {
                console.log('User preferences updated successfully.');
                window.location.reload();
            } else {
                console.error('Failed to update user preferences.');
            }
        } catch (error) {
            console.error('An error occurred while updating user preferences:', error);
        }
    };
    
    return (
        <div className='py-10'>
            <div className='flex justify-around'>
                
                <div className={`${SettingStyle}`}>
                    <h1 className='text-center font-bold text-2xl'>Account Information</h1>

                    <div className='mt-6 flex flex-col gpa6'>
                        <Attribute attribute='Full Name' value={user?.firstName + ' ' + user?.lastName}></Attribute>
                        <Attribute attribute='Username' value={user?.username}></Attribute>
                        <Attribute attribute='Email' value={user?.email}></Attribute>
                        {user?.isSysAdmin ? <Attribute attribute='Account Type' value={'admin'}/>
                        :
                        (user?.isAdmin ? <Attribute attribute='Account Type' value={'grantor'}/> : 
                        <Attribute attribute='Account Type' value={'applicant'}></Attribute>)}
                        {user?.isAdmin ? <Attribute attribute='Organization' value={user?.organization}></Attribute> : <></>}
                    </div>
                    
                    <div className='flex flex-col justify-center gap-2 w-[250px]'>
                        <HomeButton />
                        <SignOutButton/>
                    </div>
                    
                </div>

                <div className={`${SettingStyle}`}>
                    <h1 className='text-center underline font-bold text-2xl'>Accessibility</h1>

                    <div className='flex flex-col items-start gap-10'>

                    
                        <div className='flex flex-col'>
                            <h2 className='font-semibold mb-2 text-[1.2rem]'>Physical</h2>
                            <div className='mb-2'>Our website supports nagivation between components with intuitive Tab Controls
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

                            <div>Shortcuts:
                                <ul className='flex flex-col ml-4'>
                                    <li>
                                        - <b>Home Page</b>: <b className='underline'>ALT + H</b> &nbsp;(<b className='underline'>COMMAND + H</b> for <b>Mac</b>)
                                    </li>
                                    {
                                        user?.isAdmin ? <></> :
                                        <div>
                                            <li>
                                                - <b>View Grants</b>: <b className='underline'>ALT + G</b> &nbsp;(<b className='underline'>COMMAND + G</b> for <b>Mac</b>)
                                            </li>
                                            <li>
                                                - <b>View Applications</b>: <b className='underline'>ALT + I</b> &nbsp;(<b className='underline'>COMMAND + I</b> for <b>Mac</b>)
                                            </li>
                                        </div>
                                    }
                                </ul>
                            </div>
                        </div>

                        
                        <div className='flex flex-col'>
                            <h2 className='font-semibold mb-2 underline text-[1.2rem]'>Visual</h2>
                            <div className='mb-2'>Font and View can be resized on command with default browser support
                                <ul className='flex flex-col ml-4'>
                                    <li>
                                        - press <b className='underline'>CTRL + '+'</b> to zoom in (replace <b className='underline'>CTRL</b> with <b className='underline'>COMMAND</b> for Mac)
                                    </li>
                                    <li>
                                        - press <b className='underline'>CTRL + '-'</b> to zoom out (replace <b className='underline'>CTRL</b> with <b className='underline'>COMMAND</b> for Mac)
                                    </li>
                            
                                </ul>
                            </div>

                            <div className='mt-4'>
                                <h1 className='font-bold'>Preferences:</h1>
                                <ul className='flex flex-col ml-4'>
                                    <li className='flex gap-2'>
                                        <b>Simple Background Graphics</b>
                                        <input type="checkbox" aria-label="Toggle simple background graphics"  checked={checker[0]}
                                               onChange={() => preferenceHandler(0)}/>
                                    </li>           
                                    <li className='flex gap-2'>
                                        <b>High Contrast</b>
                                        <input type="checkbox" aria-label="Toggle high contrast" checked={checker[1]}
                                            onChange={() => preferenceHandler(1)}/>
                                    </li>   
                                </ul>
                            </div>
                        </div>
                        

                        <div className='mb-20'>
                            <h2 className='font-semibold underline text-[1.2rem]'>Auditory</h2>
                            <div>Our website supports text-to-speech for browser extensions, find some below</div>
                        </div>
                    </div>

                    <div className='w-full mb-4'>
                        <h2 className='font-semibold text-center text-[1.2rem] mb-4'>
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
