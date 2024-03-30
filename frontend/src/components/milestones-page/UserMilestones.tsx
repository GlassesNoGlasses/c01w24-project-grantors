import { FormEvent, useEffect, useState } from "react";
import ApplicationsController from "../../controllers/ApplicationsController";
import { Application, ApplicationStatus } from "../../interfaces/Application";
import { useUserContext } from "../contexts/userContext";
import { GrantMilestone, MilestoneEvidence } from "../../interfaces/Grant";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Modal } from '../modal/Modal'; 
import DropZoneFile from "../files/dropzone/DropZoneFile";
import { evidenceFileAccept } from "../files/FileUtils";
import FileController from "../../controllers/FileController";

const UserMilestonesPage = () => {
    const { user } = useUserContext();
    const [approvedApplications, setApprovedApplications] = useState<Application[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    
    
    const handleCloseModalAndNavigate = () => {
        setShowModal(false);
    };

    // Fetch user applications
    useEffect(() => {
        if (!user) return;

        ApplicationsController.fetchUserApplications(user, user).then((applications: Application[]) => {
            const approved = applications.filter((application: Application) => 
                application.status === ApplicationStatus.approved);
            setApprovedApplications(approved);
        });
    }, [user]);
    
    const handleMilestoneSubmit = (e: FormEvent<HTMLFormElement>, milestone: GrantMilestone, files: File[]) => {
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

        if (files?.length) {
            FileController.uploadFiles("evidence" + milestone.id, files, user).then((uploadedCount: number | undefined) => {
                if (uploadedCount && uploadedCount < files.length) {
                    console.error("Error while uploading files");
                    return;
                }
            });
        }

        // Get the application that contains the milestone
        const application = updatedApplications.find((app) => app.milestones.find((m) => m.id === milestone.id));
        if (!application) return;

        ApplicationsController.submitApplication(user, application).then((success) => {
            if (!success) {
                console.log("Milestone submission failed.");
                return;
            }
            setShowModal(true);
            console.log("Milestone submitted successfully.");
            setApprovedApplications(updatedApplications);
        });
    }

    const MilestoneItem = ({ milestone }: { milestone: GrantMilestone }) => {
        const [evidence, setEvidence] = useState<MilestoneEvidence>(milestone.evidence);
        const [files, setFiles] = useState<File[]>([]);

        const FileDisplay = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
            return (
                <button type='button' className='px-5 py-2 bg-secondary hover:bg-primary
                    text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
                    text-base' tabIndex={-1} {...props}>
                    Add Files
                </button>
            )
        }

        const handleFileUpload = (files: File[]) => {
            setEvidence((prevEvidence) => ({
                ...prevEvidence,
                files: [...(prevEvidence.files ?? []), ...(files.map((file) => file.name))]
            }));

            setFiles((prevFiles) => [...prevFiles, ...files]);
        }

        const handleMilestoneTextChange = (e: FormEvent<HTMLTextAreaElement>) => {
            setEvidence((prevEvidence) => ({
                ...prevEvidence,
                text: (e.target as HTMLTextAreaElement).value
            }));
        }

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
                <form onSubmit={e => handleMilestoneSubmit(e, {...milestone, evidence: evidence}, files)} className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                        <label id={`evidence-label-${milestone.id}`} className="text-base">Evidence</label>
                        <div className="flex flex-row justify-between items-center w-full pb-1">
                            <div>
                                <DropZoneFile
                                    fileLimit={25}
                                    FileCallback={handleFileUpload}
                                    dropZoneElement={<FileDisplay aria-labelledby={`evidence-label-${milestone.id}`}/>}
                                    acceptedFileTypes={evidenceFileAccept}
                                />
                            </div>
                            <div className="flex flex-col max-h-40 overflow-y-auto">
                                {
                                    evidence.files?.length ?
                                    evidence.files.map((file) => (
                                        <div key={file} className="flex flex-row gap-2">
                                            <p className="block text-gray-700 font-semibold">{file}</p>
                                        </div>
                                    ))
                                    :
                                    <p className="block text-gray-700 font-semibold">'No files uploaded.'</p>
                                }
                            </div>
                        </div>
                        <textarea id="evidence" aria-labelledby={`evidence-label-${milestone.id}`} required readOnly={milestone.completed}
                            className="p-3 px-5 text-base rounded-md ring-2 ring-primary focus:ring-secondary"
                            value={evidence.text} onChange={handleMilestoneTextChange} placeholder="Description of evidence"></textarea>
                    </div>
                    {!milestone.completed && <div className="flex flex-row gap-4 justify-end items-center">
                        {
                            (milestone.evidence?.text !== evidence.text || 
                            milestone.evidence.files?.length != evidence.files?.length) && 
                            <p className="text-base text-red-500">Careful: There are unsubmitted changes</p>
                        }
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
        <div className="py-8 px-6 flex flex-col gap-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Grants Awarded</h1>
                {approvedApplications.length > 0 ? 
                    approvedApplications.map((application: Application) =>
                        <GrantItem key={application.id} application={application} />) :
                    <p className="text-lg">There have been no grants awarded to you.</p>}
            </div>
            <Modal showModal={showModal} closeModal={handleCloseModalAndNavigate} openModal={() => setShowModal(true)}>
			<div className='flex h-[100vh] w-[100vw] justify-center items-center'>
				<div className='bg-white h-fit w-2/5 border-4 border-blue-400 border-solid rounded-lg'>
					<div className='h-full w-full'>
						<p className='text-xl text-center font-semibold'>
							{`You have submitted the milestone successfully.`}
						</p>
						<div className='flex flex-row justify-center'>
							<button className='p-2 px-5 m-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700
								text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
								text-base text-center justify-center align-middle flex pb-1'
								onClick={handleCloseModalAndNavigate}>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
		</Modal>
        </div>
    );
};

export default UserMilestonesPage;