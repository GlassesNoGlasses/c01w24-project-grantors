import { GrantBrowseProps } from "./GrantBrowseProps";
import { useUserContext } from "../contexts/userContext";
import { useEffect, useState } from "react";
import { Grant } from "../interfaces/Grant";
import GrantList from "../grant-list/GrantList";

const GrantBrowse = ({}: GrantBrowseProps) => {
    const { user } = useUserContext();
    return user?.isAdmin ? <AdminGrantBrowse /> : <UserGrantBrowse />;
}

const UserGrantBrowse = () => {
    const [grants, setGrants] = useState<Grant[]>([
        {
            id: 1,
            title: "Community Accessibility Grant",
            description: "This grant aims to fund projects that improve accessibility for people with disabilities within local communities.",
            posted: new Date("2024-02-15"),
            deadline: new Date("2024-03-31"),
            amount: 5000,
            organization: "Local Community Foundation",
            category: "Community Development",
            contact: "John Doe, johndoe@example.com"
        },
        {
            id: 2,
            title: "Educational Accessibility Initiative",
            description: "Funding available for educational institutions seeking to implement accessibility enhancements for students with disabilities.",
            posted: new Date("2024-02-20"),
            deadline: new Date("2024-04-15"),
            amount: 10000,
            organization: "Education Enhancement Fund",
            category: "Education",
            contact: "Jane Smith, janesmith@example.com"
        },
        {
            id: 3,
            title: "Accessible Technology Research Grant",
            description: "This grant supports research projects focused on developing innovative accessible technologies for people with disabilities.",
            posted: new Date("2024-02-25"),
            deadline: new Date("2024-05-30"),
            amount: 15000,
            organization: "Tech Innovations Foundation",
            category: "Technology",
            contact: "Alex Johnson, alexjohnson@example.com"
        },
        {
            id: 4,
            title: "Employment Accessibility Grant",
            description: "Funding available for businesses implementing accessibility measures to improve employment opportunities for people with disabilities.",
            posted: new Date("2024-03-01"),
            deadline: new Date("2024-06-15"),
            amount: 7500,
            organization: "Employment Equality Agency",
            category: "Employment",
            contact: "Michael Brown, michaelbrown@example.com"
        },
        {
            id: 5,
            title: "Accessible Healthcare Services Grant",
            description: "This grant aims to support healthcare facilities in making their services more accessible to patients with disabilities.",
            posted: new Date("2024-03-05"),
            deadline: new Date("2024-07-31"),
            amount: 12000,
            organization: "Healthcare Access Foundation",
            category: "Healthcare",
            contact: "Emily Davis, emilydavis@example.com"
        }
    ]);

    const [filteredGrants, setFilteredGrants] = useState<Grant[]>(grants);

    return (
        <div className="flex flex-col lg:flex-row gap-3 p-2">
            <GrantFilter grants={grants} setGrants={setFilteredGrants} />
            <GrantList grants={filteredGrants} />
        </div>
    )
}

const AdminGrantBrowse = () => {
    return (
        <div>
            <h1>Admin Grant Browse</h1>
        </div>
    )
}

const GrantFilter = ({ grants, setGrants }: {
    grants: Grant[],
    setGrants: (grants: Grant[]) => void
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
            if (minAmount !== 0 && grant.amount < minAmount)
                return false;
            if (maxAmount !== 0 && grant.amount > maxAmount)
                return false;
            if (postedAfter !== null && grant.posted < postedAfter)
                return false;
            if (dueBy !== null && grant.deadline > dueBy)
                return false;

            return true;
        }));
    }, [search, category, minAmount, maxAmount, postedAfter, dueBy, grants, setGrants]);

    return (
        <div className="flex flex-col gap-1 lg:w-1/3">
            <h1 className="text-2xl">Grant Filter</h1>
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
                <div>
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
    )
}

export default GrantBrowse;