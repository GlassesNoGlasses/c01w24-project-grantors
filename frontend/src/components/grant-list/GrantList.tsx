import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { GrantListProps } from "./GrantListProps";
import { Grant } from "../interfaces/Grant";
import { GrantItemProps } from "./GrantItemProps";
import { useUserContext } from "../contexts/userContext";
import { StarIcon } from '@heroicons/react/24/solid';


const GrantList = ({ grants }: GrantListProps) => {
    return (
        <ul className="flex flex-col gap-3">
            {grants.map((grant, index) => (
                <li key={index}>
                    <GrantItem grant={grant} />
                </li>
            ))}
        </ul>
    );
}

export const GrantItem = ({ grant, link }: GrantItemProps) => {
    const { user, setUser } = useUserContext();
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
      const isFav = user?.favoriteGrants?.includes(grant.id);
      setIsFavorite(isFav ?? false);
  }, [user, grant.id]);
  

  const toggleFavorite = async () => {
    if (!user || !grant.id) {
        console.log("No user logged in or invalid grant.");
        return;
    }

    const isCurrentlyFavorite = user.favoriteGrants?.includes(grant.id);
    const updatedFavorites = isCurrentlyFavorite
        ? user.favoriteGrants?.filter(favGrantId => favGrantId !== grant.id)
        : [...(user.favoriteGrants ? user.favoriteGrants : []), grant.id];
    try {
        const response = await fetch(`http://localhost:${8000}/users/${user.accountID}/favorites`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ favoriteGrants: updatedFavorites }),
        });

        if (!response.ok) {
            throw new Error('Failed to update favorites');
        }

        setUser({ ...user, favoriteGrants: updatedFavorites });
        setIsFavorite(!isCurrentlyFavorite);
    } catch (error) {
        console.error('Error updating favorites:', error);
    }
};

      

    return (
        <Link to={link ? link : `/grants/${grant.id}`}
            className="flex flex-col gap-3 p-1 px-3 rounded-md shadow-sm border
                bg-slate-50 active:bg-slate-100 hover:shadow-md">
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-2xl font-bold">{grant.title}</h1>
                <h2 className="text-lg">{`CAD $${grant.minAmount.toString()} - $${grant.maxAmount.toString()}`}</h2>
                <button onClick={(e) => { 
                  e.preventDefault();
                  toggleFavorite(); 
                }}>
                    <StarIcon className={`h-6 w-6 ${isFavorite ? 'text-yellow-500' : 'text-gray-500'}`} />
                </button>
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
    )
}

export default GrantList;