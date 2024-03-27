import React, { useEffect, useState } from 'react'
import { User, UserTypes } from '../../../interfaces/User';
import UserController from '../../../controllers/UserController';
import { Cookies } from 'react-cookie';
import DropDownFilter from '../../filter/DropDownFilter';


const UserCard = () => {

}


const UserFilter = ({ users, setUsers }: {
    users: User[],
    setUsers: (grants: User[]) => void,
}) => {
    const [search, setSearch] = useState<string>("");
    const [ userType, setUserType ] = useState<UserTypes | undefined>(undefined);

    const userTypeDropDownOptions = Object.values(UserTypes);

    useEffect(() => {
        setUsers(users.filter(user => {
            if (search !== "" && !user.email?.toLowerCase().includes(search.toLowerCase()))
                return false;
            if (search !== "" && !user.username?.toLowerCase().includes(search.toLowerCase()))
                return false;
            if (search !== "" && !user.firstName?.toLowerCase().includes(search.toLowerCase()))
                return false;
            if (search !== "" && !user.lastName?.toLowerCase().includes(search.toLowerCase()))
                return false;
            if (userType && userType == UserTypes.admin)
                return user.isSysAdmin;
            if (userType && userType == UserTypes.grantor)
                return user.isAdmin && !user.isSysAdmin;
            if (userType && userType == UserTypes.grantee)
                return !user.isAdmin && !user.isSysAdmin;

            return true;
        }));
    }, [search, userType, users, setUsers]);

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


    useEffect(() => {
        const userToken = new Cookies().get('user-token');

        if (!userToken) return;
        
        UserController.fetchUsers(userToken).then((users: User[] | undefined) => {
            if (users) setUsers(users);
        });

    }, [users]);

    console.log(users)
  return (
    <div className='py-24 px-10'>
        <UserFilter users={users} setUsers={setUsers}/>
        {users.map((user) => {
            return <div>{user.username}</div>
        })}
    </div>
    
  )
}

export default UserList