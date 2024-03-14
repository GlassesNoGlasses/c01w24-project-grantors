import { useEffect, useState } from "react";
import { SearchFilterProps } from "./SearchFilerProps";

function SearchFilter({label, onChange}: SearchFilterProps ) {
    const [ search, setSearch ] = useState<string>("");

    useEffect(() => {
        onChange(search);
    }, [search]);

    return (
        <div className="flex flex-col gap-1">
            <p className="text-base">{label}</p>
            <input type="text" className="border border-black rounded-lg text-sm p-1 px-2"
                value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
    );
};

export default SearchFilter;