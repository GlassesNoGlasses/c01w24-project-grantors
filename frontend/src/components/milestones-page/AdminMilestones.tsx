import { useEffect, useState } from "react";
import { GrantMilestone } from "../../interfaces/Grant";
import { Application, ApplicationStatus } from "../../interfaces/Application";
import { useUserContext } from "../contexts/userContext";
import ApplicationsController from "../../controllers/ApplicationsController";
import UserController from "../../controllers/UserController";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { FSFile } from "../../interfaces/FSFile";
import FileController from "../../controllers/FileController";
import { DownloadWrapper } from "../files/download/DownloadWrapper";

const AdminMilestonesPage = () => {
    const { user } = useUserContext();
    const [approvedApplications, setApprovedApplications] = useState<Application[]>([]);
    const [neededFiles, setFiles] = useState<FSFile[]>([]); // [FSFile

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

    useEffect(() => {
        if (user) {
            approvedApplications.forEach((application: Application) => {
                FileController.fetchUserFSFiles(application?.applicantID).then((files: FSFile[] | undefined) => {
                    if (files) {
                        const neededFiles = files.filter((file: FSFile) => {
                            return approvedApplications?.some((application: Application) => {
                                return application.milestones.some((milestone: GrantMilestone) => {
                                    return milestone.evidence.files?.includes(file.title);
                                });
                            });
                        });
                        setFiles((prev) => [...prev, ...neededFiles]);
                    }
                });
            });
        }
        
    }, [approvedApplications, user]);

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

    const formatFileLink = (file: string) => {
        const fsFile = neededFiles.find((fsFile: FSFile) => fsFile.title === file);
        return fsFile?.file ?
                <div key={file} className="flex flex-col">
                    {
                        <DownloadWrapper element={<span className="underline">{file}</span>} file={fsFile.file} /> 
                    }
                </div>
                :
                <p key={file} className="block text-gray-700 font-semibold">'No files uploaded.'</p>;
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
                        <div className="flex flex-col max-h-40 overflow-y-auto">
                                {
                                    milestone.evidence.files?.length ?
                                    milestone.evidence.files.map((file) => (
                                        formatFileLink(file)
                                    ))
                                    :
                                    <p className="block text-gray-700 font-semibold">'No files uploaded.'</p>
                                }
                        </div>
                        <textarea name="evidence" id="evidence" required readOnly
                            className="p-3 px-5 text-base rounded-md ring-2 ring-primary focus:ring-secondary"
                            value={milestone.evidence.text}></textarea>
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
        <div className="p-8 px-6 flex flex-col gap-10">
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