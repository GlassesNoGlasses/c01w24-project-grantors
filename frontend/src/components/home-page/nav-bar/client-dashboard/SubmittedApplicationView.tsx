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
        <div className="py-10 flex justify-center w-full">
            <div id="view-container" className="flex flex-col rounded-xl border-4 border-primary pb-8 bg-white
            shadow-2xl shadow-black w-[90vw]">
                <div id="view-header" className="px-8 py-4">
                    <h1 className="text-xl font-bold">Your Application is being processed</h1>
                    <br></br>
                    <h2 className="text-xl font-bold">Please wait until a decision is made on your application</h2>
                </div>
            </div>
        </div>
    );
};

export default ApplicationView;
