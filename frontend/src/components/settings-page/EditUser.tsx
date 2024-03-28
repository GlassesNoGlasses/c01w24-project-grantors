import React, { useEffect, useState } from 'react'
import UserController from '../../controllers/UserController'
import { Link, useParams } from 'react-router-dom'
import emailIcon from '../../images/iconMail.png';
import nameIcon from '../../images/iconName.png';
import passwordIcon from '../../images/iconPassword.png';

    const EditUser = () => {

        const [username, setUsername] = useState('')
        const [email, setEmail] = useState('')
        const [firstName, setFirstName] = useState('')
        const [lastName, setLastName] = useState('')
        const [changePassword, setChangePassword] = useState(false)
        const [password, setPassword] = useState('')
        const [feedback, setFeedback] = useState<String | undefined>('')
        

        const { userID } = useParams()

        const gett = async () => {
            if (userID) {
                const user = await UserController.fetchAUser(userID)
                if (!user) {return}
                setUsername(user.username ? user.username.toString() : '')
                setEmail(user.email ? user.email.toString() : '')
                setFirstName(user.firstName ? user.firstName.toString() : '')
                setLastName(user.lastName ? user.lastName.toString() : '')
            }
        }
        
        useEffect(() =>{
            gett()
        }, [])

        const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (!userID) return
            const response = await UserController.updateUser(userID, username, email, firstName, lastName, password);
            setFeedback(response)
        };
    

        return (
            <div className="flex items-center justify-center min-h-screen pt-20 bg-home-background bg-cover 
                bg-no-repeat bg-center h-[100vh] w-[100vw] fixed z-[-1]">
                <div className="w-full max-w-xs px-4 py-6 mx-auto bg-white rounded-xl 
                    sm:px-6 sm:py-8 md:max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-xl
                    flex flex-col gap-4 border-4 border-primary shadow-2xl shadow-black"
                    style={{ boxShadow: '-10px 10px 30px 0 rgba(0, 0, 0, 0.1)' }}>
                    <h3 className="text-xl font-bold text-center sm:text-2xl text-gray-700">Edit User</h3>
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit} onChange={() => setFeedback('')}>
                        <div className='flex flex-row'>
                            <div className="flex items-center w-[49%] mr-[2%]">
                                <img src={nameIcon} alt="Password"
                                    className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
                                <input
                                    type="firstName"
                                    id="firstName"
                                    placeholder="Enter First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-3 py-2 mt-2 border border-gray-200 rounded-full focus:outline-none
                                    focus:ring focus:ring-green-600 sm:px-4 sm:py-3"
                                    style={{ boxShadow: 'inset -4px 4px 6px rgba(0, 0, 0, 0.1)'}}
                                    required
                                />
                            </div>
                            <div className="flex items-center w-[49%]">
                                <input
                                    type="lastName"
                                    id="lastName"
                                    placeholder="Enter Last Name"
                                    value={lastName.toString()}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-3 py-2 mt-2 border border-gray-200 rounded-full focus:outline-none
                                    focus:ring focus:ring-green-600 sm:px-4 sm:py-3"
                                    style={{ boxShadow: 'inset -4px 4px 6px rgba(0, 0, 0, 0.1)'}}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="flex items-center">
                            <img src={emailIcon} alt="Email"
                                className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
                            <input
                                type="text"
                                id="email"
                                placeholder="Enter Email"
                                value={email.toString()}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 mt-2 border border-gray-200 rounded-full focus:outline-none
                                focus:ring focus:ring-green-600 sm:px-4 sm:py-3"
                                style={{ boxShadow: 'inset -4px 4px 6px rgba(0, 0, 0, 0.1)'}}
                                required
                            />
                        </div>
                        <div className="flex items-center">
                            <img src={nameIcon} alt="Username"
                                className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
                            <input
                                type="text"
                                id="username"
                                placeholder="Enter Username"
                                value={username.toString()}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-2 mt-2 border border-gray-200 rounded-full focus:outline-none
                                focus:ring focus:ring-green-600 sm:px-4 sm:py-3"
                                style={{ boxShadow: 'inset -4px 4px 6px rgba(0, 0, 0, 0.1)'}}
                                required
                            />
                        </div>

                        { changePassword ?
						<div className="flex items-center">
							<img src={passwordIcon} alt="Username"
                                className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
							<input
							type="password"
							id="organization"
							placeholder="Enter New Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-3 py-2 mt-2 border border-gray-200 rounded-full focus:outline-none
								focus:ring focus:ring-green-600 sm:px-4 sm:py-3"
							style={{ boxShadow: 'inset -4px 4px 6px rgba(0, 0, 0, 0.1)'}}
							required
							/>
						</div>
						: null
					}
                        
                        <label className='flex flex-row gap-2 text-secondary text-sm ml-2'>
                            Change Password?
                            <input
                                type="checkbox"
                                checked={changePassword}
                                onChange={() => setChangePassword(!changePassword)}
						/>
						</label>
                        
                        <div className="flex justify-between items-center">

                            <Link
                                to='/users'
                                type="button" 
                                className='p-2 px-5 bg-primary hover:bg-[#7db8b7] w-fit h-fit text-center
                                text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
                                text-base'>Back to Users
                            </Link>
                            <button
                                type="submit" 
                                className='p-2 px-5 m-2 bg-secondary hover:bg-[#7db8b7] w-fit
                                text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
                                text-base'>Save Changes
                            </button>
                           
                        </div>
                    </form>
                    <div className='flex items-center h-5 justify-center'>
                        <span className='font-bold'>{feedback}</span>
                    </div>
                </div>
            </div>
        )
    }

export default EditUser