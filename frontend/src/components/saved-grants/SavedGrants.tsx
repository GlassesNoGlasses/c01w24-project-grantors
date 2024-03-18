import { useEffect, useState } from "react";
import { useUserContext } from "../contexts/userContext";
import { Grant } from "../../interfaces/Grant";
import GrantList from "../grant-list/GrantList";
import GrantsController from "../../controllers/GrantsController";

const SavedGrants = () => {
    const { user } = useUserContext();
    return <UserGrantBrowse />;
}

const UserGrantBrowse = () => {
    const { user } = useUserContext();
    const [filteredGrants, setFilteredGrants] = useState<Grant[]>([]);

    useEffect(() => {
        if (user) {
            GrantsController.fetchFavouriteGrants(user.accountID).then((grants: Grant[] | undefined) => {
                if (grants) {
                    setFilteredGrants(grants);
                }
            });
        }
    }, [user]);

    return (
        <div className="flex flex-col lg:flex-row gap-3 p-2">
            <GrantList grants={filteredGrants} favouriteGrants={filteredGrants.map((grant) => grant.id)} />
        </div>
    );
}

export default SavedGrants;
