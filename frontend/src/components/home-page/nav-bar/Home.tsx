import DefaultPage from './default-page/DefaultPage';
import AdminDashboard from './admin-dashboard/AdminDashboard';
import ClientDashboard from './client-dashboard/ClientDashboard';
import { useUserContext } from '../../contexts/userContext';
import { HomeProps } from './HomeProps';
import { User } from '../../interfaces/user';

const Home = ({}: HomeProps) => {
// SECTION: States Used
const {user, setUser} = useUserContext();
const testAdmin: User = {accountID: "1", isAdmin: true, username: "testName", 
  firstName: "jim", lastName: "admin", email: "123@gmail.com", password: "none"};
const testClient: User = {accountID: "2", isAdmin: false, username: "asdad",
  firstName:"bob", lastName: "client", email: "000@outlook.ca", password: "ok"};

// SECTION: Render Functions
const RenderHomepage = () => {
  if (!user) {
    return (<DefaultPage/>);
  }

  return user.isAdmin ? (<AdminDashboard/>) : (<ClientDashboard/>);
};

return (
  <div className='h-full w-full'>
    {RenderHomepage()}
    <button onClick={() => setUser(testAdmin)}>Admin</button>
    <button onClick={() => setUser(testClient)}>Client</button>
  </div>
  )
};

export default Home