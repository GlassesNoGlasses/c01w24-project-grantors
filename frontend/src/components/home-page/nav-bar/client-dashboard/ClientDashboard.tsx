import React from 'react'
import { useUserContext } from '../../../contexts/userContext';
import ButtonIcon from '../../../displays/ButtonIcon/ButtonIcon';
import { Cog6ToothIcon, ArrowRightStartOnRectangleIcon, UserIcon, StarIcon, ListBulletIcon, DocumentMagnifyingGlassIcon} from '@heroicons/react/24/solid';
import search from '../../../../images/search.png'
import ApplicationIcon from '../../../displays/ApplicationIcon/ApplicationIcon';


const ClientDashboard = () => {
  const {user, setUser} = useUserContext();

  return (
    <div className="dashboard-container bg-lime-500 w-full h-full">
      <div className="welcome-message underline px-10 bold text-4xl">Welcome{user ? ", " + user.username + "!" : ""}</div>
      <div className="client-butons flex justify-around items-center p-10">
        <ButtonIcon heroicon={<StarIcon className=""/>} label="Saved Grants"/>
        <ButtonIcon heroicon={<UserIcon className=""/>} label="Account"/>
        <ButtonIcon heroicon={<Cog6ToothIcon className=""/>} label="Settings"/>
        <ButtonIcon heroicon={<ArrowRightStartOnRectangleIcon className=""/>} label="Log out"/>
      </div>
      <div className="application-buttons flex justify-around items-center">
        <ApplicationIcon heroicon={<ListBulletIcon/>} label="View Available Grants" />
        <ApplicationIcon imageSrc={search} label="My Applications"/>
      </div>
    </div>
  )
}

export default ClientDashboard