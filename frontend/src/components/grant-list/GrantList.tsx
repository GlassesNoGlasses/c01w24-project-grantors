import { Link } from "react-router-dom";
import { GrantListProps } from "./GrantListProps";
import { Grant } from "../interfaces/Grant";

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

const GrantItem = ({ grant }: { grant: Grant }) => {
    return (
        <Link to={`/grants/${grant.id}`}
            className="flex flex-col gap-3 p-1 px-3 rounded-md shadow-sm border
                bg-slate-50 active:bg-slate-100 hover:shadow-md">
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-2xl font-bold">{grant.title}</h1>
                <h2 className="text-lg">{`CAD $${grant.amount.toString()}`}</h2>
            </div>
            <div className="flex flex-row justify-between">
                <h3 className="text-lg">{grant.organization}</h3>
                <h4 className="text-base">{grant.category}</h4>
            </div>
            <div className="flex flex-col">
                <p className="text-sm">{`Posted: ${grant.posted.toDateString()}`}</p>
                <p className="text-sm">{`Deadline: ${grant.deadline.toDateString()}`}</p>
            </div>    
            <p className="text-base">{grant.description}</p>
        </Link>
    )
}

export default GrantList;