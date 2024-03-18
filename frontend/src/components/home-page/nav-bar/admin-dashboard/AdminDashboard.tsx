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
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = ({

  }: AdminDashboardProps) => {

    // States used
    const {user, setUser} = useUserContext();
    const [grantID, setGrantID] = useState('');
    const [encodedOrg, setEncodedOrg] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setGrantID(event.target.value);
    };

  useEffect(() => {
    if (user?.organization) {
      return setEncodedOrg(encodeURIComponent(user.organization));
    } else {
      return setEncodedOrg('');
    }
  }, [user]);

  return (
    <div className='h-full bg-grantor-green flex flex-col gap-28'>
      <h2 className='text-6xl underline text-white pl-8'>Welcome, {user?.username}!</h2>
      <div className='flex justify-evenly items-center'>
        <div>
        <Link to='/createGrant'>
          <ButtonIcon imageSrc={addIcon} label={"New Grant"}/>
        </ Link>
        </div>
        <ButtonIcon imageSrc={userIcon} label={"My Account"}/>
        <ButtonIcon imageSrc={settingsIcon} label={"Settings"}/>
        <Link to="/">
          <ButtonIcon imageSrc={logoutIcon} label={"Log Out"} callback={() => setUser(null)}/>
        </Link>
      </div>
      <div className='flex justify-evenly items-center h-1/4'>
        <Link to={`admin/grants`}>
          <ApplicationIcon imageSrc={list} label={"View Hosted Grants"}/>
        </Link>
        <Link to={`${encodedOrg}/applications`}>
          <ApplicationIcon imageSrc={search} label={"Review Applications"}/>
        </Link>
      </div>
    </div>
  )
}

export default AdminDashboard

