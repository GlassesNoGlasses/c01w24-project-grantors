import { StarIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ApplicationsController from "../../../../controllers/ApplicationsController";
import { Application } from "../../../../interfaces/Application";
import UserController from "../../../../controllers/UserController";
import { Applicant } from "../../../../interfaces/Applicant";
import { Grant, GrantQuestion } from "../../../../interfaces/Grant";
import GrantsController from "../../../../controllers/GrantsController";
import { useUserContext } from "../../../contexts/userContext";

const ApplicationView = () => {
    const { applicationID } = useParams();
    const [application, setApplication] = useState<Application | undefined>();
    const [applicant, setApplicant] = useState<Applicant | undefined>();
    const [grant, setGrant] = useState<Grant | undefined>();

    useEffect(() => {
        if (applicationID) {
            ApplicationsController.fetchApplication(applicationID).then(setApplication);
        }
    }, [applicationID]);

    useEffect(() => {
        if (application) {
            UserController.fetchApplicant(application.applicantID).then(setApplicant);
            GrantsController.fetchGrant(application.grantID).then(setGrant);
        }
    }, [application]);

    return (
        <div id="view-container" className="flex flex-col shadow-[0_4px_25px_rgba(0,0,0,0.2)] rounded m-8 pb-8">
            <div id="view-header" className="px-8 py-4">
                <span className="text-xl font-bold">Application Details</span>
            </div>
            <div className="flex flex-row justify-between px-8 gap-4">
                <div id="application-info-container" className="flex flex-col w-full gap-4">
                    <div id="applicant-info" className="flex flex-col border-2 rounded border-gray-200 p-4">
                        <h2 className="text-lg font-semibold">Applicant Information</h2>
                        <p><strong>Name:</strong> {applicant ? `${applicant.firstName} ${applicant.lastName}` : 'Applicant not found'}</p>
                        <p><strong>Email:</strong> {applicant ? applicant.email : 'Applicant not found'}</p>
                    </div>
                    <div id="grant-info-container" className="flex flex-col border-2 rounded border-gray-200 p-4">
                        <h2 className="text-lg font-semibold">Grant Information</h2>
                        <p><strong>Title:</strong> {grant ? grant.title : "Grant not found"}</p>
                        <p><strong>Description:</strong> {grant ? grant.description : "Grant not found"}</p>
                        <p><strong>Category:</strong> {grant ? grant.category : "Grant not found"}</p>
                        <p><strong>Funding Amount:</strong> {grant ? `${grant.minAmount} - ${grant.maxAmount}` : "Grant not found"}</p>
                        <p><strong>Deadline:</strong> {grant ? new Date(grant.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric'}) : "Grant not found"}</p>
                    </div>
                    <div id="application-fields" className="flex flex-col border-2 rounded border-gray-200 p-4">
                        <h2 className="text-lg font-semibold">Application Questions and Responses</h2>
                        {application ? application.responses.map((response: GrantQuestion, index: number) => (
                            <div key={index} className="mt-2">
                                <p className="font-bold">{response.question}</p>
                                <p>{response.answer}</p>
                            </div>
                        )) : <p>Application responses not found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationView;
