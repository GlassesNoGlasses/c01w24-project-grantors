import React from 'react'
import { useUserContext } from '../contexts/userContext'

const Settings = () => {

    const { user } = useUserContext()

    const SettingStyle = 'bg-white w-[40vw] h-[80vh] border-4 border-primary shadow-2xl \
                    shadow-black rounded-xl flex flex-col p-4'

    return (
        <div className='pt-24'>
            <div className='flex justify-around'>
                <div className={`${SettingStyle}`}>
                    <h1 className='text-center font-bold text-2xl'>Account Information</h1>

                    <div>
                        <h2>Full Name </h2>
                        <h2>Username {user?.username}</h2>
                        <h2>Email</h2>
                        <h2>Organization</h2>
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