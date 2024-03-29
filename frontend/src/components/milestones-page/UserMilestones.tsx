import { FormEvent, useEffect, useState } from "react";
import ApplicationsController from "../../controllers/ApplicationsController";
import { Application, ApplicationStatus } from "../../interfaces/Application";
import { useUserContext } from "../contexts/userContext";
import { GrantMilestone } from "../../interfaces/Grant";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

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
    }, [user]);
    
    const handleMilestoneSubmit = (e: FormEvent<HTMLFormElement>, milestone: GrantMilestone) => {
        e.preventDefault();
        if (!user) return;

        const updatedApplications = approvedApplications.map((application: Application) => {
            if (application.milestones.find((m) => m.id === milestone.id)) {
                return {
                    ...application,
                    milestones: application.milestones.map((m) => m.id === milestone.id ? milestone : m)
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
        const [evidence, setEvidence] = useState<string>(milestone.evidence);

        return (
            <div className="flex flex-col gap-2 py-4 px-5 border-2 border-magnify-dark-blue rounded-md bg-magnify-light-blue">
                <div className="flex flex-row justify-between align-middle">
                    <h4 className="text-lg font-bold">{milestone.title}</h4>
                    {
                    milestone.completed ? 
                    <CheckIcon className="h-10 w-10 text-green-500" aria-label="milestone completed"/> 
                    : 
                    <XMarkIcon className="h-10 w-10 text-red-500" aria-label="milestone not completed" />}
                </div>
                <p className="text-sm">Due: {new Date(milestone.dueDate).toDateString()}</p>
                <p className="text-base">{milestone.description}</p>
                <form onSubmit={e => handleMilestoneSubmit(e, {...milestone, evidence: evidence})} className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                        <label id={`evidence-label-${milestone.id}`} className="text-base">Evidence</label>
                        <textarea id="evidence" aria-labelledby={`evidence-label-${milestone.id}`} required readOnly={milestone.completed}
                            className="p-3 px-5 text-base rounded-md ring-2 ring-primary focus:ring-secondary"
                            value={evidence} onChange={e => setEvidence(e.target.value)}></textarea>
                    </div>
                    {!milestone.completed && <div className="flex flex-row gap-4 justify-end items-center">
                        {milestone.evidence !== evidence && <p className="text-base text-red-500">Careful: There are unsubmitted changes</p>}
                        <button type="submit" 
                            className='p-2 px-5 m-2 bg-primary hover:bg-secondary 
                            text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
                            text-base w-fit'>
                            Submit Milestone
                        </button>
                    </div>}
                </form>
            </div>
        )
    }

    const GrantItem = ({ application }: { application: Application }) => {
        return (
            <div key={application.id} className="flex flex-col gap-2 py-4 px-5 border-2 border-magnify-dark-blue rounded-md bg-white shadow-lg">
                <div className="flex flex-row justify-between align-middle">
                    <h2 className="text-2xl font-bold">{application.grantTitle}</h2>
                    <p className="text-lg">Awarded ${application.awarded}</p>
                </div>
                <p className="text-base">{application.grantCategory}</p>
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
                    <p className="text-lg">There have been no grants awarded to you.</p>}
            </div>
        </div>
    );
};

export default UserMilestonesPage;