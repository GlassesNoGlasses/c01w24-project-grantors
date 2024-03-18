import { useState } from 'react';
import { ApplicationFilterProps } from "./ApplicationFilterProps";
import { Application } from '../../interfaces/Application';
import SearchFilter from './SearchFilter';

const ApplicationFilter = ({applications, setApplications}: ApplicationFilterProps) => {
    const [search, setSearch] = useState<string>("");
    const [postedAfter, setPostedAfter] = useState<Date | null>(null);
    
    return (
        <div className="flex flex-col gap-1 lg:w-1/3">
            <h1 className="text-2xl">Application Filter</h1>
            <SearchFilter label={"Grant Title"} onChange={(searchString: string) => {
                setApplications(applications.filter((application: Application) => {
                    application.grantTitle.includes(searchString);
                }))
            }}/>
            {/* <div className="flex flex-col">
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
            </div> */}
        </div>
    );
};

export default ApplicationFilter;