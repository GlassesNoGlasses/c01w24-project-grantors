import { useEffect, useState } from "react";
import { useUserContext } from "../../../contexts/userContext";
import { Application, ApplicationStatus } from "../../../interfaces/Application";
import { mockApplications } from "../admin-dashboard/mockApplications";
import { Column } from "../../../table/TableProps";
import Table from "../../../table/Table";
import { SERVER_PORT } from "../../../../constants/ServerConstants";
import { Grant } from "../../../interfaces/Grant";
import { useNavigate } from "react-router-dom";

type TableData = [Application, Grant | undefined];

const ClientApplicationList = ({}) => {
    const { user, setUser } = useUserContext();
    const [ applications, setApplications ] = useState<Application[]>(mockApplications);
    const [ grants, setGrants ] = useState<Grant[]>();
    const [ tableData, setTableData ] = useState<TableData[]>([]);

    const navigate = useNavigate();

    const itemsPerPageOptions: number[] = [5,10,20,50,100];
    const columns: Column<TableData>[] = [
        {
            title: "Grant Titlte",
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
        const fetchApplications = async () => {
            const res = await fetch(`http://localhost:${SERVER_PORT}/getUserApplications/${user?.accountID}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user?.authToken}`
                },
              });

            if (res.ok) {
                await res.json().then((data) => {
                    return setApplications(data.applications);
                });
            } else {
                // Bad response, logout the user and redirect
                console.log(res);
                setUser(null);
                navigate('/login')
            }
        }

        //fetchApplications();
    }, [user]);

    useEffect(() => {
        const grantIDs: number[] = applications.map((app: Application) => app.grantID);
        const encodedGrantIDs: string = encodeURIComponent(grantIDs.join(','));
        const fetchGrants = async () => {
            const res = await fetch(`http://localhost:${SERVER_PORT}/getGrants/${encodedGrantIDs}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.ok) {
                await res.json().then((data) => {
                    return setGrants(data);
                })
            } else {
                console.log(res);
                setUser(null);
            }
        }

        //fetchGrants();

    }, [applications]);

    useEffect(() => {
        // Table data is made of applications and grant pairs
        setTableData(applications.map((app: Application) => {
            return [app, grants?.find(grant => grant.id === app.grantID)];
        }));

    }, [applications, grants])

    return (
        <div className="flex flex-col h-full items-start justify-start px-5 bg-grantor-green">
            <span className="text-2xl pl-2">My Applications</span>
            <Table items={tableData}
                   columns={columns}
                   itemsPerPageOptions={itemsPerPageOptions}
                   defaultIPP={10}
                   defaultSort={columns[1]}
            />
        </div>
    )
};

export default ClientApplicationList;