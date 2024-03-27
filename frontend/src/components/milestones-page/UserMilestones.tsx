import { useEffect, useState } from "react";
import ApplicationsController from "../../controllers/ApplicationsController";
import { Application, ApplicationStatus } from "../../interfaces/Application";
import { useUserContext } from "../contexts/userContext";
import { GrantMilstone } from "../../interfaces/Grant";
import { Check, X } from "heroicons-react";

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

const MilestoneItem = ({ milestone }: { milestone: GrantMilstone }) => {
    return (
        <div className="flex flex-col gap-2 p-2 px-5">
            <div className="flex flex-row justify-between align-middle">
                <h3 className="text-lg font-bold">{milestone.title}</h3>
                {milestone.completed ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-red-500" />}
            </div>
            <p className="text-sm">Due: {new Date(milestone.dueDate).toDateString()}</p>
            <p className="text-base">{milestone.description}</p>
            <form className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                    <label htmlFor="evidence">Evidence</label>
                    <textarea name="evidence" id="evidence" required></textarea>
                </div>
                <button type="submit" 
                    className='p-2 px-5 m-2 bg-primary hover:bg-secondary 
                    text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
                    text-base'>
                    Submit Milestone
                </button>
            </form>
        </div>
    )
}

export default UserMilestonesPage;