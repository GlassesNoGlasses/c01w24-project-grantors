import { useUserContext } from "../contexts/userContext";
import UserMilestonesPage from "./UserMilestones";
import AdminMilestonesPage from "./AdminMilestones";

const MilestonesPage = () => {
    const { user } = useUserContext();

    return !user?.isAdmin ? <UserMilestonesPage /> : <AdminMilestonesPage />;
};

export default MilestonesPage;