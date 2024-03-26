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
        <div id="view-container" className="flex flex-col rounded-xl border-4 border-primary pb-8 bg-white
        shadow-2xl shadow-black">
            <div id="view-header" className="px-8 py-4">
                <span className="text-xl font-bold">Congratulations! Your grant has been approved.</span>
                <br></br>
                <span className="text-xl font-bold">Application Information</span>
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
                        <p><strong>Funding Amount:</strong> {application ? `${application.awarded}` : "Grant not found"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationView;
