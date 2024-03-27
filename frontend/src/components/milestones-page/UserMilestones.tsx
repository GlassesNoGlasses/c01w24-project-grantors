import { useEffect, useState } from "react";
import ApplicationsController from "../../controllers/ApplicationsController";
import { Application, ApplicationStatus } from "../../interfaces/Application";
import { useUserContext } from "../contexts/userContext";

const UserMilestonesPage = () => {
    const { user } = useUserContext();
    const [approvedApplications, setApprovedApplications] = useState<Application[]>([]);

    // Fetch user applications
    useEffect(() => {
        if (!user) return;

        ApplicationsController.fetchUserApplications(user).then((applications: Application[]) => {
            const approved = applications.filter((application: Application) => 
                application.status === ApplicationStatus.approved);
            setApprovedApplications(approved);
        });
    });

    const userMilestones = approvedApplications.map((application: Application) => application.milestones).flat();

    const incompleteMilestones = userMilestones.filter((milestone) => !milestone.completed)
                                               .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

    const completedMilestones = userMilestones.filter((milestone) => milestone.completed)
                                              .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

    return (
        <div className="py-24">
            <h1>User Milestones Page</h1>
            <div className="py-8">
                <h2>Approved Applications</h2>
                <ul>
                    {approvedApplications.map((application: Application) => (
                        <li key={application.id}>{application.grantTitle}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserMilestonesPage;