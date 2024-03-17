import { Route, Routes } from "react-router-dom";
import Navbar from "./components/nav-bar/Navbar";
import Home from "./components/home-page/nav-bar/Home";
import Login from "./components/login-page/Login";
import SignUp from "./components/signup-page/SignUp";
import GrantForm from "./components/grant/grant";
import { UserContextProvider } from "./components/contexts/userContext";
import {CreateGrant, EditGrant} from "./components/admin-grant-managment";
import GrantBrowse from "./components/grant-browse/GrantBrowse";
import AdminApplicationList from "./components/home-page/nav-bar/admin-dashboard/AdminApplicationList";
import GrantPage from "./components/grant-page/GrantPage";
import ClientApplicationList from "./components/home-page/nav-bar/client-dashboard/ClientApplicationList";
import AdminGrants from "./components/home-page/nav-bar/admin-dashboard/admin-grants/AdminGrants";
import SavedGrants from "./components/saved-grants/SavedGrants";
import GrantApply from "./components/grant-apply/GrantApply";

function App() {

  return (
    <div className="App" style={AppStyle}>
      {UserContextProvider(
        <Routes>
            <Route path="/" element={<Navbar />}>
              <Route index element={<Home />} />
              <Route path="about" element={<Home />} />
              <Route path="services" element={<Home />} />
              <Route path="gallery" element={<Home />} />
              <Route path="contact" element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="grant" element={<GrantForm />} />
              <Route path="createGrant" element={<CreateGrant />} />
              <Route path="editGrant/:grantId" element={<EditGrant />} />
              <Route path="grants" element={<GrantBrowse />} />
              <Route path="grants/:grantId" element={<GrantPage />} />
              <Route path="admin/grants" element={<AdminGrants />} />
              <Route path="admin/grants/:grantId" element={<EditGrant />} />
              <Route path="saved" element={<SavedGrants />} />
              <Route path=":organization/applications" element={<AdminApplicationList/>} />
              <Route path="applications" element={<ClientApplicationList />} />
              <Route path="grants/:grantId/apply" element={<GrantApply />} />
            </Route>
          </Routes>
        )}
    </div>
  );
}

export default App;

const AppStyle = {
  height: "100vh",
  width: "100vw",
}
