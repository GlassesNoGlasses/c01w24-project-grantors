import { FormEvent, useEffect, useState } from "react";
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
    }, [user]);

    const userMilestones = approvedApplications.map((application: Application) => application.milestones).flat();

    const incompleteMilestones = userMilestones.filter((milestone) => !milestone.completed)
                                               .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

    const completedMilestones = userMilestones.filter((milestone) => milestone.completed)
                                              .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
    
    const handleMilestoneSubmit = (e: FormEvent<HTMLFormElement>, milestone: GrantMilstone) => {
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

    const MilestoneItem = ({ milestone }: { milestone: GrantMilstone }) => {
        const [evidence, setEvidence] = useState<string>(milestone.evidence);

        return (
            <div className="flex flex-col gap-2 py-4 px-5 border-2 border-magnify-dark-blue rounded-md bg-magnify-light-blue">
                <div className="flex flex-row justify-between align-middle">
                    <h3 className="text-lg font-bold">{milestone.title}</h3>
                    {milestone.completed ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-10 w-10 text-red-500" />}
                </div>
                <p className="text-sm">Due: {new Date(milestone.dueDate).toDateString()}</p>
                <p className="text-base">{milestone.description}</p>
                <form onSubmit={e => handleMilestoneSubmit(e, {...milestone, evidence: evidence})} className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="evidence" className="text-base">Evidence</label>
                        <textarea name="evidence" id="evidence" required readOnly={milestone.completed}
                            className="p-3 px-5 text-base rounded-md ring-2 ring-primary focus:ring-secondary"
                            value={evidence} onChange={e => setEvidence(e.target.value)}></textarea>
                    </div>
                    {!milestone.completed && <div className="flex flex-row justify-end">
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

    return (
        <div className="py-24 px-5">
            {incompleteMilestones.length > 0 && (
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold">Incomplete Milestones</h2>
                    {incompleteMilestones.map((milestone) => (
                        <MilestoneItem key={milestone.id} milestone={milestone} />
                    ))}
                </div>
            )}

            {completedMilestones.length > 0 && (
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold">Completed Milestones</h2>
                    {completedMilestones.map((milestone) => (
                        <MilestoneItem key={milestone.id} milestone={milestone} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserMilestonesPage;