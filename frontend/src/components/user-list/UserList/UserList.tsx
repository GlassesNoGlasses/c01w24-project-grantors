import React, { useEffect, useState } from 'react'
import { User, UserTypes } from '../../../interfaces/User';
import UserController from '../../../controllers/UserController';
import { Cookies } from 'react-cookie';
import DropDownFilter from '../../filter/DropDownFilter';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../contexts/userContext';
import { Modal } from '../../modal/Modal'; 

const UserCard = ({ user, curUser} : {user: User, curUser: User | null}) => {

    const [showModal, setShowModal] = useState<boolean>(false);

    const handleCloseModalAndNavigate = () => {
        setShowModal(false);
        window.location.reload();
    };

    return (<div className='flex justify-between p-6 w-full items-center rounded-xl
            border-4 border-primary shadow-xl shadow-black bg-white text-base'>
        <div className='flex flex-col justify-around'>
            <h2>
                <b>Account Type:</b> &nbsp; {user.isSysAdmin ? 'Admin' : (user.isAdmin ? 'Grantor' : 'Grantee')}
            </h2>
            {user.isAdmin && !user.isSysAdmin ? 
            <h2><b>Organization:</b> &nbsp; {user.organization} </h2> : ''}
            <h2><b>Username:</b> &nbsp; {user.username}</h2>
            <h2><b>Email:</b> &nbsp; {user.email}</h2>
            <h2><b>Name:</b> &nbsp; {user.firstName + ' ' + user.lastName}</h2>
        </div>
        
        <div className='flex flex-col gap-4 items-end'>
            {user.isSysAdmin ? <></> :
            <Link to='/statistics' className='bg-primary hover:bg-secondary h-fit w-full py-2 px-4
                rounded-xl text-white text-center'>
                Statistics
            </Link>}

            <div className='flex gap-4'>

                <Link to={`/users/${user.accountID}`} className='bg-orange-400 hover:bg-orange-500 
                h-fit w-fit py-2 px-4 rounded-xl text-white'>
                    Edit
                </Link>

                {user.accountID === curUser?.accountID ? <></> : <button className='bg-red-500 hover:bg-red-600 h-fit w-fit py-2 px-4 rounded-xl text-white' onClick={async () => {
                try {
                    await UserController.deleteUser(user.accountID);
                    setShowModal(true);
                } catch (error) {
                    console.error("Failed to delete user", error);
                }
                }}>
                    Remove
                </button>}

            </div>
            <Modal showModal={showModal} closeModal={handleCloseModalAndNavigate} openModal={() => setShowModal(true)}>
			<div className='flex h-[100vh] w-[100vw] justify-center items-center'>
				<div className='bg-white h-fit w-2/5 border-4 border-blue-400 border-solid rounded-lg'>
					<div className='h-full w-full'>
						<p className='text-xl text-center font-semibold'>
							{`User with username: ${user.username} has been successfully deleted.`}
						</p>
						<div className='flex flex-row justify-center'>
							<button className='p-2 px-5 m-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700
								text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
								text-base text-center justify-center align-middle flex pb-1'
								onClick={handleCloseModalAndNavigate}>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
		</Modal>
        </div>
        
    </div>)
}


const UserFilter = ({ users, setFilteredUsers }: {
    users: User[],
    setFilteredUsers: (grants: User[]) => void,
}) => {
    const [search, setSearch] = useState<string>("");
    const [ userType, setUserType ] = useState<UserTypes | undefined>(undefined);

    const userTypeDropDownOptions = Object.values(UserTypes);

    useEffect(() => {
        setFilteredUsers(users.filter(user => {
            if (search !== "" && !user.email?.toLowerCase().includes(search.toLowerCase())
            && !user.username?.toLowerCase().includes(search.toLowerCase())
            && !user.firstName?.toLowerCase().includes(search.toLowerCase())
            && !user.lastName?.toLowerCase().includes(search.toLowerCase()))
                return false;
            if (userType && userType == UserTypes.admin && !user.isSysAdmin)
                return false;
            if (userType && userType == UserTypes.grantor && (user.isSysAdmin || !user.isAdmin))
                return false;
            if (userType && userType == UserTypes.grantee && (user.isSysAdmin || user.isAdmin))
                return false;

            return true;
        }));
    }, [search, userType]);

    const onAccountTypeFilterChange = (type: string) => {
        if (Object.values(UserTypes).includes(type as UserTypes)) {
            setUserType(type as UserTypes);
        } else {
            setUserType(undefined);
        }
    };

    return (
        <div className="flex flex-col gap-1 pt-8 pb-16 px-10 border-4 bg-white rounded-xl
        border-primary shadow-2xl shadow-black h-fit">
            <h1 className="text-2xl font-bold mb-6">User Filter</h1>
            <div className="flex flex-col gap-1">
                <p className="text-base">Search Name, Username, or Email</p>
                <input type="text" className="border border-black rounded-lg text-sm p-1 px-2"
                    value={search} onChange={(event) => setSearch(event.target.value)} />
                <DropDownFilter className="text-white" label="Account Types" options={userTypeDropDownOptions}
                identity="AccountType" setFilter={onAccountTypeFilterChange}/>
            </div>
        </div>

    );
};


const UserList = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const {user} = useUserContext()

    const init = () => {
        const userToken = new Cookies().get('user-token');

        if (!userToken) return;
        
        UserController.fetchUsers(userToken).then((users: User[] | undefined) => {
            if (users) setUsers(users);
            if (users) setFilteredUsers(users)
        });
    }

    useEffect(() => {
        init()
    }, []);

    return (
        <div className='p-10 flex justify-around'>
            <div className='pt-28'>
                <UserFilter users={users} setFilteredUsers={setFilteredUsers}/>
            </div>

            <div className='flex flex-col gap-6 h-[80vh] w-[60vw] overflow-scroll p-10'>
                {filteredUsers.length === 0 ?
                <div className='text-center font-bold text-base'>Hmmm.... There are no users with the given searching citeria</div>
                :filteredUsers.map((notCurUser, index) => {
                    return <UserCard user={notCurUser} curUser={user} key={index}/>
                })}
            </div>
            
        </div>
        
    )
}

export default UserList