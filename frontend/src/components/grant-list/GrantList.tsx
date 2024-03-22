import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { GrantListProps } from "./GrantListProps";
import { GrantItemProps } from "./GrantItemProps";
import { useUserContext } from "../contexts/userContext";
import { StarIcon } from '@heroicons/react/24/solid';
import GrantsController from '../../controllers/GrantsController';

const GrantList = ({ grants, favouriteGrants }: GrantListProps) => {
    return (
        <ul className="flex flex-col gap-5 w-full px-1">
            {grants.map((grant, index) => (
                <li key={index}>
                    <GrantItem grant={grant} favourite={favouriteGrants.includes(grant.id)} />
                </li>
            ))}
        </ul>
    );
};

export const GrantItem = ({ grant, link, favourite }: GrantItemProps) => {
    const { user } = useUserContext();
    const [isFavourite, setIsFavourite] = useState(favourite);

    useEffect(() => {
        setIsFavourite(favourite);
        
    }, [favourite]);


    const toggleFavorite = async () => {
        if (!user || !grant.id) {
            console.log("No user logged in or invalid grant.");
            return;
        }

        await GrantsController.toggleFavouriteGrant(user.accountID, grant.id).then((success: boolean) => {
            if (success) {
                setIsFavourite(!isFavourite);
            }
        });
    };

    return (
        <Link to={link ? link : `/grants/${grant.id}`}
            className="flex flex-col gap-3 p-1 px-3 rounded-lg shadow-md border-secondary
                bg-slate-50 active:bg-slate-100 hover:border-black border-4 shadow-black">
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-2xl font-bold">{grant.title}</h1>
                <div className="flex flex-row gap-2">
                    <h2 className="text-lg">{`CAD $${grant.minAmount.toString()} - $${grant.maxAmount.toString()}`}</h2>
                    <button onClick={(e) => { 
                        e.preventDefault();
                        toggleFavorite(); 
                    }}>
                        <StarIcon className={`h-6 w-6 ${isFavourite ? 'text-yellow-500' : 'text-gray-500'}`} />
                    </button>
                </div>
            </div>
            <div className="flex flex-row justify-between">
                <h3 className="text-lg">{`Org: ${grant.organization}`}</h3>
                <h4 className="text-base">{`Categories: ${grant.category}`}</h4>
            </div>
            <div className="flex flex-col">
                <p className="text-sm">{`Posted: ${grant.posted ? grant.posted.toDateString() : 'N/A'}`}</p>
                <p className="text-sm">{`Deadline: ${grant.deadline ? grant.deadline.toDateString() : 'N/A'}`}</p>
            </div>    
            <p className="text-base">{grant.description}</p>
        </Link>
    );
};

export default GrantList;