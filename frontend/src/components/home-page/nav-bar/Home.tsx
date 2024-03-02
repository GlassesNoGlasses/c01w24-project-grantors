import { useState } from 'react'
import DefaultPage from './default-page/DefaultPage';
import AdminDashboard from './admin-dashboard/AdminDashboard';
import ClientDashboard from './client-dashboard/ClientDashboard';
import { useUserContext } from '../../contexts/userContext';
import { HomeProps } from './HomeProps';
import { User, UserType } from '../../interfaces/user';

const Home = ({
}: HomeProps) => {

  // SECTION: States Used
  const {user, setUser} = useUserContext();
  const userType = user?.type;
  const testAdmin: User = {id: 1, type: UserType.Admin, username: "testName"};
  const testClient: User = {id: 2, type: UserType.Client, username: "asdad"};

  // SECTION: Render Functions
  const RenderHomepage = () => {
    switch (userType) {
      case UserType.Admin:
        return (<AdminDashboard/>);
      case UserType.Client:
        return (<ClientDashboard/>);
      default:
        return (<DefaultPage/>);
    };
  };

  return (
    <div>
      {RenderHomepage()}
      <button onClick={() => setUser(testAdmin)}>Admin</button>
    </div>
  )
}

export default Home