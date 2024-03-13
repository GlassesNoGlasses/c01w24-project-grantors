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
              <Route path=":organization/applications" element={<AdminApplicationList/>} />
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
