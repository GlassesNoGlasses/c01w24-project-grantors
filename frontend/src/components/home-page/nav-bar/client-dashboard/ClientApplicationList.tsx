import { useEffect, useState } from "react";
import { useUserContext } from "../../../contexts/userContext";
import { Application, ApplicationStatus } from "../../../../interfaces/Application";
import { Column } from "../../../table/TableProps";
import { useParams, useNavigate } from 'react-router-dom';
import Table from "../../../table/Table";
import { Grant } from "../../../../interfaces/Grant";
import GrantsController from "../../../../controllers/GrantsController";
import ApplicationsController from "../../../../controllers/ApplicationsController";
import { Link } from "react-router-dom";

type TableData = [Application, Grant];

const grantNotFound: Grant = {
    id: '',
    title: 'Grant not found.',
    description: '',
    posted: new Date(),
    deadline: new Date(),
    minAmount: 0,
    maxAmount: 0,
    organization: '',
    category: '',
    contact: '',
    questions: [],
    publish: false,
}

const ClientApplicationList = ({}) => {
    const { user, setUser } = useUserContext();
    const [ applications, setApplications ] = useState<Application[]>([]);
    const [ grants, setGrants ] = useState<Grant[]>([]);
    const [ tableData, setTableData ] = useState<TableData[]>([]);
    const [ filteredTabledata, setFilteredTableData ] = useState<TableData[]>([])
    const navigate = useNavigate();

    const itemsPerPageOptions: number[] = [5,10,20,50,100];
    const columns: Column<TableData>[] = [
        {
            title: "Grant Title",
            format: (data: TableData) => data[0].grantTitle,
            sort: (data1: TableData, data2: TableData) => data1[0].grantTitle < data2[0].grantTitle ? -1 : 1,
        },
        {
            title: "Status",
            format: (data: TableData) => data[0].status,
            sort: (data1: TableData, data2: TableData) => {
                if (data1[0].status === data2[0].status) return 0;
                if (data1[0].status === ApplicationStatus.inProgress) return 1;
                return -1;
            },
        },
        {
            title: "Deadline",
            format: (data: TableData) => {
                return data[1] ? data[1].deadline.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }) : "";
            },
            sort: (data1: TableData, data2: TableData) => Number(data1[1]?.deadline) - Number(data2[1]?.deadline),
        },
    ];

    useEffect(() => {
        if (user) {
            ApplicationsController.fetchUserApplications(user).then((applications: Application[]) => {
                setApplications(applications);
            });
        }

    }, [user]);

    useEffect(() => {
        if (applications.length) {
            const grantIDs: string[] = applications.map((app: Application) => app.grantID);

            GrantsController.fetchGrants(grantIDs).then((grants: Grant[] | undefined) => {
                if (grants) {
                    setGrants(grants);
                }
            });
        }
        
    }, [applications]);

    useEffect(() => {
        // Table data is made of applications and grant pairs
        setTableData(applications.map((app: Application) => {
            return [app, grants.find(grant => grant.id === app.grantID) ?? grantNotFound];
        }));

    }, [applications, grants]);

    useEffect(() => {
        setFilteredTableData(tableData);
    }, [tableData]);

    const onApplicationRowClick = (data: TableData) => {
        navigate(`/grants/${data[0].grantID}/apply`);
    }

    return (
        <div className="pt-28 p-4">
            <div className="flex flex-col h-full items-start justify-start p-6 bg-primary
                rounded-2xl border-4 border-white shadow-2xl shadow-black">
                <span className="text-2xl text-white mb-4">My Applications</span>
                    {applications.length > 0 ? 
                        <Table items={tableData}
                    columns={columns}
                    itemsPerPageOptions={itemsPerPageOptions}
                    defaultIPP={10}
                    defaultSort={columns[1]}
                    onRowClick={onApplicationRowClick}
                    /> :
                    <div className="text-white flex flex-row mt-2">
                        <h1>You Have No Applications</h1>
                        <p className="text-white">, Apply To Grants &nbsp;
                            <Link to='/grants' className="text-[#0bb4d6] underline hover:text-black">here</Link> !
                        </p>
                    </div>
                }
            </div>
        </div>
    );
};

export default ClientApplicationList;
