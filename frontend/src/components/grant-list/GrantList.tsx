import { Link } from "react-router-dom";
import { GrantListProps } from "./GrantListProps";
import { Grant } from "../interfaces/Grant";
import { GrantItemProps } from "./GrantItemProps";

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
    return (
        <Link to={link ? link : `/grants/${grant.id}`}
            className="flex flex-col gap-3 p-1 px-3 rounded-md shadow-sm border
                bg-slate-50 active:bg-slate-100 hover:shadow-md">
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-2xl font-bold">{grant.title}</h1>
                <h2 className="text-lg">{`CAD $${grant.minAmount.toString()} - $${grant.maxAmount.toString()}`}</h2>
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