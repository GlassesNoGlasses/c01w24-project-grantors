import { useEffect, useState } from "react";
import { useUserContext } from "../../../contexts/userContext";
import { Application, ApplicationStatus } from "../../../../interfaces/Application";
import { Column } from "../../../table/TableProps";
import Table from "../../../table/Table";
import { Grant } from "../../../../interfaces/Grant";
import GrantsController from "../../../../controllers/GrantsController";
import ApplicationsController from "../../../../controllers/ApplicationsController";

type TableData = [Application, Grant | undefined];

const ClientApplicationList = ({}) => {
    const { user, setUser } = useUserContext();
    const [ applications, setApplications ] = useState<Application[]>([]);
    const [ grants, setGrants ] = useState<Grant[]>();
    const [ tableData, setTableData ] = useState<TableData[]>([]);

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
            return [app, grants?.find(grant => grant.id === app.grantID)];
        }));

    }, [applications, grants]);

    return (
        <div className="pt-28 p-4">
            <div className="flex flex-col h-full items-start justify-start p-6 bg-primary
            rounded-2xl border-4 border-white shadow-2xl shadow-black">
                <span className="text-2xl pl-2">My Applications</span>
                <Table items={tableData}
                    columns={columns}
                    itemsPerPageOptions={itemsPerPageOptions}
                    defaultIPP={10}
                    defaultSort={columns[1]}
                />
            </div>
        </div>
    );
};

export default ClientApplicationList;
