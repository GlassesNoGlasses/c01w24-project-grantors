import { useEffect, useState } from "react";
import { useUserContext } from "../contexts/userContext";
import { Grant } from "../../interfaces/Grant";
import GrantList from "../grant-list/GrantList";
import GrantsController from "../../controllers/GrantsController";
import { Link } from "react-router-dom";

const SavedGrants = () => {
    const { user } = useUserContext();
    return (
        <div className="pt-20">
            <UserGrantBrowse />
        </div> 
    )
}

const UserGrantBrowse = () => {
    const { user } = useUserContext();
    const [filteredGrants, setFilteredGrants] = useState<Grant[]>([]);

    useEffect(() => {
        if (user) {
            GrantsController.fetchFavouriteGrants(user.accountID).then((grants: Grant[]) => {
                setFilteredGrants(grants);
            });
        }
    }, [user]);

    return (
        filteredGrants.map((grant) => grant.id).length > 0 ?
        <div className="flex flex-col lg:flex-row gap-3 p-2">
            <GrantList grants={filteredGrants} favouriteGrants={filteredGrants.map((grant) => grant.id)} />
        </div> :
        <div className="pl-10 bg-white">
            <p className="font-bold text-xl mb-4">Hey There! It Looks Like You Have No Saved Grants</p>
            <p>You Can Favourite a Grant From The List &nbsp;
                <Link to='/grants' className="underline text-blue-500 hover:text-blue-800">here</Link> !
            </p>
        </div>
    );
}

export default SavedGrants;
