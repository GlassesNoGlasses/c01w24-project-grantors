import { GrantBrowseProps } from "./GrantBrowseProps";
import { useUserContext } from "../contexts/userContext";
import { useEffect, useState } from "react";
import { Grant } from "../../interfaces/Grant";
import GrantList from "../grant-list/GrantList";
import GrantsController from "../../controllers/GrantsController";

const GrantBrowse = ({}: GrantBrowseProps) => {
    const { user } = useUserContext();
    return user?.isAdmin ? <AdminGrantBrowse /> : <UserGrantBrowse />;
}

const UserGrantBrowse = () => {
    const { user } = useUserContext();
    const [grants, setGrants] = useState<Grant[]>([]);

    const [filteredGrants, setFilteredGrants] = useState<Grant[]>(grants);
    const [favouriteGrants, setFavouriteGrants] = useState<string[]>([]);

    useEffect(() => {
        if (user) {
            fetchGrants();
            GrantsController.fetchFavouriteGrants(user.accountID).then((grants: Grant[]) => {
                setFavouriteGrants(grants.map((grant: Grant) => grant.id));
            });
        }

    }, [user]);

    useEffect(() => {
        setFilteredGrants(grants)
    }, [grants]);

    // Fetch all grants
    const fetchGrants = async () => {
        GrantsController.getPublishedGrants().then((grants: Grant[]) => {
            setGrants(grants);
        });
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 pl-8 py-20 h-[100vh]">
            <div className="flex items-center">
                <GrantFilter grants={grants} setGrants={setFilteredGrants} />
            </div>

            <GrantList grants={filteredGrants} favouriteGrants={favouriteGrants} />
        </div>
    );
};

const AdminGrantBrowse = () => {
    return (
        <div>
            <h1>Admin Grant Browse</h1>
        </div>
    );
};

const GrantFilter = ({ grants, setGrants }: {
        grants: Grant[],
        setGrants: (grants: Grant[]) => void,
    }) => {
    const [search, setSearch] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [minAmount, setMinAmount] = useState<Number>(0);
    const [maxAmount, setMaxAmount] = useState<Number>(0);
    const [postedAfter, setPostedAfter] = useState<Date | null>(null);
    const [dueBy, setDueBy] = useState<Date | null>(null);

    useEffect(() => {
        setGrants(grants.filter(grant => {
            if (search !== "" && !grant.title.toLowerCase().includes(search.toLowerCase()))
                return false;
            if (category !== "" && !grant.category.toLowerCase().includes(category.toLowerCase()))
                return false;
            if (minAmount !== 0 && grant.maxAmount < minAmount)
                return false;
            if (maxAmount !== 0 && grant.minAmount > maxAmount)
                return false;
            if (postedAfter !== null && grant.posted < postedAfter)
                return false;
            if (dueBy !== null && grant.deadline > dueBy)
                return false;

            return true;
        }));
    }, [search, category, minAmount, maxAmount, postedAfter, dueBy, grants, setGrants]);

    return (
        <div className="flex flex-col gap-1 pt-8 pb-16 px-10 border-4 bg-white rounded-xl
        border-primary shadow-2xl shadow-black h-fit">
            <h1 className="text-2xl font-bold mb-6">Grant Filter</h1>
            <div className="flex flex-col gap-1">
                <p className="text-base">Search</p>
                <input type="text" className="border border-black rounded-lg text-sm p-1 px-2"
                    value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-base">Category</p>
                <input type="text" className="border border-black rounded-lg text-sm p-1 px-2"
                    value={category} onChange={(event) => setCategory(event.target.value)} />
            </div>
            <div className="flex flex-col">
                <div>
                    <p className="text-base">Amount</p>
                    <div className="flex flex-row gap-4 flex-wrap">
                        <div>
                            <p className="text-sm">Min</p>
                            <input type="number" className="border border-black rounded-lg text-sm p-1 px-2"
                                value={minAmount as number} onChange={(event) => setMinAmount(event.target.valueAsNumber)} />
                        </div>
                        <div>
                            <p className="text-sm">Max</p>
                            <input type="number" className="border border-black rounded-lg text-sm p-1 px-2"
                                value={maxAmount as number} onChange={(event) => setMaxAmount(event.target.valueAsNumber)} />
                        </div>
                    </div>
                </div>

                <div className="w-fit">
                    <p className="text-base">Date</p>
                    <div className="flex flex-row gap-4">
                        <div>
                            <p className="text-sm">Posted After</p>
                            <input type="date" className="border border-black rounded-lg text-sm p-1 px-2"
                                value={postedAfter?.toISOString().split('T')[0] as string}
                                onChange={(event) => setPostedAfter(event.target.valueAsDate)} />
                        </div>
                        <div>
                            <p className="text-sm">Due By</p>
                            <input type="date" className="border border-black rounded-lg text-sm p-1 px-2"
                                value={dueBy?.toISOString().split('T')[0] as string}
                                onChange={(event) => setDueBy(event.target.valueAsDate)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default GrantBrowse;