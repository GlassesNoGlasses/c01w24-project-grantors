import { Route, Routes } from "react-router-dom";
import Navbar from "./components/nav-bar/Navbar";
import Home from "./components/home-page/nav-bar/Home";
import Login from "./components/login-page/Login";
import SignUp from "./components/signup-page/SignUp";
import { UserContextProvider } from "./components/contexts/userContext";
import {CreateGrant, EditGrant} from "./components/admin-grant-managment";
import GrantBrowse from "./components/grant-browse/GrantBrowse";
import AdminApplicationList from "./components/home-page/nav-bar/admin-dashboard/AdminApplicationList";
import GrantPage from "./components/grant-page/GrantPage";
import ClientApplicationList from "./components/home-page/nav-bar/client-dashboard/ClientApplicationList";
import AdminGrants from "./components/home-page/nav-bar/admin-dashboard/admin-grants/AdminGrants";
import SavedGrants from "./components/saved-grants/SavedGrants";
import GrantApply from "./components/grant-apply/GrantApply";
import ApplicationReview from "./components/applications/admin/ApplicationReview";
import DefaultPage from "./components/home-page/nav-bar/default-page/DefaultPage";
import NotFoundPage from "./components/not-found-page/NotFoundPage";
import Settings from "./components/settings-page/Settings";
import React, { useEffect } from 'react';
import Background from "./components/background/Background";




function App() {

	useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.altKey && event.key === 'h' || event.key === 'H') {
                window.location.href = '/'; 
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

	return (
		<div className="App w-full h-full">
			
			{UserContextProvider(
				<div>
					<Background />
				
					<Routes>
						<Route path="/" element={<Navbar />}>
							<Route index element={<Home />} />
							<Route path="about" element={<DefaultPage />} />
							<Route path="services" element={<Home />} />
							<Route path="gallery" element={<Home />} />
							<Route path="contact" element={<Home />} />
							<Route path="login" element={<Login />} />
							<Route path="signup" element={<SignUp />} />
							<Route path="createGrant" element={<CreateGrant />} />
							<Route path="editGrant/:grantID" element={<EditGrant />} />
							<Route path="grants" element={<GrantBrowse />} />
							<Route path="grants/:grantID" element={<GrantPage />} />
							<Route path="admin/grants" element={<AdminGrants />} />
							<Route path="admin/grants/:grantID" element={<EditGrant />} />
							<Route path="saved" element={<SavedGrants />} />
							<Route path=":organization/applications" element={<AdminApplicationList/>} />
							<Route path="applications" element={<ClientApplicationList />} />
							<Route path="grants/:grantID/apply" element={<GrantApply />} /> 
							<Route path="application/:applicationID/review" element={<ApplicationReview />} />
							<Route path="application/:applicationID/review" element={<ApplicationReview />} />
							<Route path="settings" element={<Settings />} />
							<Route path="*" element={<NotFoundPage />} />
						</Route>
					</Routes>
				</div>
			)}
		</div>
	);
};

export default App;