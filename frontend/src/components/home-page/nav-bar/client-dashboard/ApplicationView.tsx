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
import { Link } from "react-router-dom";

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
        <div className="py-10 px-10">
            <div id="view-container" className="flex flex-col rounded-xl border-4 border-primary pb-8 bg-white
            shadow-2xl shadow-black">
                <div id="view-header" className="px-8 py-4">
                    <h1 className="text-xl font-bold mb-6">Congratulations! Your grant has been approved.</h1>
                    <h2 className="text-xl font-bold">Application Information</h2>
                </div>
                <div className="flex flex-col px-8 gap-4">
                    <div id="application-info-container" className="flex flex-col w-full gap-4">
                        <div id="applicant-info" className="flex flex-col border-2 rounded-lg border-gray-200 p-4">
                            <h3 className="text-lg font-semibold">Applicant Information</h3>
                            <p><strong>Name:</strong> {applicant ? `${applicant.firstName} ${applicant.lastName}` : 'Applicant not found'}</p>
                            <p><strong>Email:</strong> {applicant ? applicant.email : 'Applicant not found'}</p>
                        </div>
                        <div id="grant-info-container" className="flex flex-col border-2 rounded-lg border-gray-200 p-4">
                            <h3 className="text-lg font-semibold">Grant Information</h3>
                            <p><strong>Title:</strong> {grant ? grant.title : "Grant not found"}</p>
                            <p><strong>Description:</strong> {grant ? grant.description : "Grant not found"}</p>
                            <p><strong>Category:</strong> {grant ? grant.category : "Grant not found"}</p>
                            <p><strong>Funding Amount:</strong> {application ? `${application.awarded}` : "Grant not found"}</p>
                        </div>
                    </div>

                    <Link role="button" to="/" className="bg-primary py-2 px-8 w-fit text-base text-white hover:bg-secondary rounded-lg mt-4 ml-2">
                        Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ApplicationView;
