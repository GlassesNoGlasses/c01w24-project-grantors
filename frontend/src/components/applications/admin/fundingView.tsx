import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApplicationsController from "../../../controllers/ApplicationsController";
import GrantsController from "../../../controllers/GrantsController";
import { Application } from "../../../interfaces/Application";
import { Grant } from "../../../interfaces/Grant";
import { useUserContext } from "../../contexts/userContext";

const ApplicationFunding = () => {
    const { applicationID } = useParams();
    const [application, setApplication] = useState<Application | undefined>();
    const [grant, setGrant] = useState<Grant | undefined>();
    const [fundingAmount, setFundingAmount] = useState<string>("");
    const navigate = useNavigate();

    const { user } = useUserContext();

    useEffect(() => {
        if (applicationID) {
            ApplicationsController.fetchApplication(applicationID).then((fetchedApplication: Application | undefined) => {
                if (fetchedApplication) {
                    setApplication(fetchedApplication);
                    GrantsController.fetchGrant(fetchedApplication.grantID).then((fetchedGrant: Grant | undefined) => {
                        if (fetchedGrant) {
                            setGrant(fetchedGrant);
                            setFundingAmount(fetchedGrant.minAmount.toString());                        }
                    });
                }
            });
        } else {
            console.error("Application ID is undefined.");
            navigate("/error");
        }
    }, [applicationID, navigate]);
    

    const handleFundingSubmission = async () => {
        const numericFundingAmount = Number(fundingAmount);
        if (!applicationID || !application || !grant || numericFundingAmount < Number(grant.minAmount) || numericFundingAmount > Number(grant.maxAmount)) {
            alert("Please specify a valid funding amount within the grant's limits.");
            return;
        }
    
        if (!user) {
            console.error("No user context available");
            return;
        }
    
        const success = await ApplicationsController.updateAwardedAmount(user, applicationID, numericFundingAmount);
        if (success) {
            navigate("/");
        } else {
            console.error("Error updating application with funding amount.");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">Assign Funding Amount</h1>
            {grant && (
                <div className="mb-4">
                    <p>Grant: {grant.title}</p>
                    <p>Funding Range: {Number(grant.minAmount)} - {Number(grant.maxAmount)}</p>
                </div>
            )}
            <div className="mb-4">
                <label htmlFor="fundingAmount" className="block text-md font-medium text-gray-700">Funding Amount</label>
                <input
                    type="number"
                    id="fundingAmount"
                    name="fundingAmount"
                    value={fundingAmount}
                    onChange={(e) => setFundingAmount(e.target.value)}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
            </div>
            <button
                onClick={handleFundingSubmission}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Submit Funding Amount
            </button>
        </div>
    );
};

export default ApplicationFunding;