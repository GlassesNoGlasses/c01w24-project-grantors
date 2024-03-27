import { Link, useParams } from "react-router-dom";
import { GrantPageProps } from "./GrantPageProps";
import { Grant } from "../../interfaces/Grant";
import { useState, useEffect } from "react";
import { useUserContext } from "../contexts/userContext";
import GrantsController from "../../controllers/GrantsController";

const GrantPage = ({}: GrantPageProps) => {
    const { grantID } = useParams();
    const [grant, setGrant] = useState<Grant | undefined>(undefined);

    useEffect(() => {
        if (grantID) {
            GrantsController.fetchGrant(grantID).then((grant: Grant | undefined) => {
                if (grant) {
                    setGrant(grant);
                }
            });
        }
    }, []);

    return grant ? <GrantFound grant={grant} /> : <GrantNotFound /> ;
};

const GrantFound = ({ grant }: { grant: Grant }) => {
    return (
        <div className="flex flex-col gap-3 py-3 px-5 bg-white border-4 border-primary mx-5 mt-24
            rounded-2xl shadow-2xl shadow-black">
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-4xl font-bold">{grant.title}</h1>
                <ApplyButton grantID={grant.id.toString()} />
            </div>
            <h1 className="text-3xl">{`CAD $${grant.minAmount} - $${grant.maxAmount}`}</h1>
            <div className="flex flex-row justify-between">
                <h2 className="text-2xl">{grant.organization}</h2>
                <h2 className="text-2xl">{`Contact: ${grant.contact}`}</h2>
            </div>
            <h3 className="text-lg">{grant.category}</h3>
            <div className="flex flex-col">
                <h3 className="text-base">{`Posted: ${grant.posted.toDateString()}`}</h3>
                <h3 className="text-base">{`Deadline: ${grant.deadline.toDateString()}`}</h3>
            </div>

            <p className="text-base">{grant.description}</p>
        </div>
    );
};

const GrantNotFound = () => {
    return (
        <div className="flex flex-col gap-3 p-1 px-3">
            <h1 className="text-4xl font-bold">Grant Not Found</h1>
            <p className="text-base">The grant you are looking for does not exist.</p>
        </div>
    );
};

const ApplyButton = ({ grantID }: { grantID: string }) => {
    const { user } = useUserContext();
    if (user && !user.isAdmin) {
        return (
            <Link
                className='p-2 px-5 m-2 bg-secondary hover:bg-primary
                    text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
                    text-lg'
                to={`/grants/${grantID}/apply`}
            >
                Apply Now
            </Link>
        );
    } else {
        return null;
    }
};

export default GrantPage;