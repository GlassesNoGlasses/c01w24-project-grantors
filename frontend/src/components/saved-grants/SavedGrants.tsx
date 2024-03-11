import { useEffect, useState } from "react";
import { useUserContext } from "../contexts/userContext";
import { Grant } from "../interfaces/Grant";
import GrantList from "../grant-list/GrantList";
import mockGrants from "../grant-browse/mockGrants";

const SavedGrants = () => {
    const { user } = useUserContext();
    return <UserGrantBrowse />;
}

const UserGrantBrowse = () => {
    const { user } = useUserContext();
    const [filteredGrants, setFilteredGrants] = useState<Grant[]>([]);

    useEffect(() => {
        if (user?.favoriteGrants) {
            const favorites = mockGrants.filter(grant => 
                user.favoriteGrants.includes(grant.id)
            );
            setFilteredGrants(favorites);
        }
    }, [user]);

    return (
        <div className="flex flex-col lg:flex-row gap-3 p-2">
            <GrantList grants={filteredGrants} />
        </div>
    );
}

export default SavedGrants;
