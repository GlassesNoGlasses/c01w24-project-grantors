import { useEffect, useState } from "react";
import { GrantMilestone } from "../../interfaces/Grant";
import { Application, ApplicationStatus } from "../../interfaces/Application";
import { useUserContext } from "../contexts/userContext";
import ApplicationsController from "../../controllers/ApplicationsController";
import UserController from "../../controllers/UserController";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

const AdminMilestonesPage = () => {
    const { user } = useUserContext();
    const [approvedApplications, setApprovedApplications] = useState<Application[]>([]);

    // Fetch org applications
    useEffect(() => {
        if (!user) return;

        ApplicationsController.fetchOrgApplications(user).then((applications: Application[] | undefined) => {
            if (!applications) return;

            const approved = applications.filter((application: Application) => 
                application.status === ApplicationStatus.approved);
            setApprovedApplications(approved);
        });
    }, [user]);

    const handleMilestoneComplete = (milestone: GrantMilestone) => {
        if (!user) return;

        const updatedApplications = approvedApplications.map((application: Application) => {
            if (application.milestones.find((m) => m.id === milestone.id)) {
                return {
                    ...application,
                    milestones: application.milestones.map((m) => m.id === milestone.id ? {...milestone, completed: true} : m)
                }
            }
            return application;
        });

        // Get the application that contains the milestone
        const application = updatedApplications.find((app) => app.milestones.find((m) => m.id === milestone.id));
        if (!application) return;

        ApplicationsController.submitApplication(user, application).then((success) => {
            if (!success) {
                console.log("Milestone submission failed.");
                return;
            }

            console.log("Milestone submitted successfully.");
            setApprovedApplications(updatedApplications);
        });
    }

    const MilestoneItem = ({ milestone }: { milestone: GrantMilestone }) => {
        return (
            <div className="flex flex-col gap-2 py-4 px-5 border-2 border-magnify-dark-blue rounded-md bg-magnify-light-blue">
                <div className="flex flex-row justify-between align-middle">
                    <h3 className="text-lg font-bold">{milestone.title}</h3>
                    {milestone.completed ? <CheckIcon className="h-10 w-10 text-green-500" /> : <XMarkIcon className="h-10 w-10 text-red-500" />}
                </div>
                <p className="text-sm">Due: {new Date(milestone.dueDate).toDateString()}</p>
                <p className="text-base">{milestone.description}</p>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="evidence" className="text-base">Evidence</label>
                        <textarea name="evidence" id="evidence" required readOnly
                            className="p-3 px-5 text-base rounded-md ring-2 ring-primary focus:ring-secondary"
                            value={milestone.evidence}></textarea>
                    </div>
                    <div className="flex flex-row justify-end">
                        {!milestone.completed && <button onClick={() => handleMilestoneComplete(milestone)}
                            className='p-2 px-5 m-2 bg-primary hover:bg-secondary 
                            text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
                            text-base w-fit'>
                            Approve Milestone
                        </button>}
                    </div>
                </div>
            </div>
        )
    }

    const GrantItem = ({ application }: { application: Application }) => {
        const [name, setName] = useState<string>("");

        useEffect(() => {
            UserController.fetchApplicant(application.applicantID).then((applicant) => {
                if (!applicant) return;
                setName(`${applicant.firstName} ${applicant.lastName}`);
            });
        }, [application]);

        return (
            <div key={application.id} className="flex flex-col gap-2 py-4 px-5 border-2 border-magnify-dark-blue rounded-md bg-white shadow-lg">
                <div className="flex flex-row justify-between align-middle">
                    <h2 className="text-2xl font-bold">{application.grantTitle}</h2>
                    <p className="text-lg">Awarded ${application.awarded}</p>
                </div>
                <p className="text-base">For: {name}</p>
                <h3 className="text-xl font-bold">Milestones</h3>
                <div className="flex flex-col gap-2">
                    {application.milestones.map((milestone) => (
                        <MilestoneItem key={milestone.id} milestone={milestone} />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="py-24 px-5 flex flex-col gap-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Grants Awarded</h1>
                {approvedApplications.length > 0 ? 
                    approvedApplications.map((application: Application) =>
                        <GrantItem key={application.id} application={application} />) :
                    <p className="text-lg">There have been no grants awarded.</p>}
            </div>
        </div>
    );
};

export default AdminMilestonesPage;