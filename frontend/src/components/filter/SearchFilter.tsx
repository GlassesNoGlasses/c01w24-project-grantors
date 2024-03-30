import { useEffect, useState } from "react";
import { SearchFilterProps } from "./SearchFilterProps";

function SearchFilter({label, setFilter, className}: SearchFilterProps ) {
    const [ search, setSearch ] = useState<string>("");

    useEffect(() => {
        setFilter(search)
    }, [search]);

    return (
        <div className={`flex flex-col gap-1t ${className}`}>
            <label id={`${label.split(' ')[0]}-search-filter`} className="text-base">{label}</label>
            <input type="text" className="border border-black rounded-lg text-sm p-1 px-2 text-black"
                value={search} onChange={(event) => setSearch(event.target.value)} aria-labelledby={`${label.split(' ')[0]}-search-filter `}/>
        </div>
    );
};

export default SearchFilter;