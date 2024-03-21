import { useEffect, useState } from 'react';
import { useUserContext } from '../../../contexts/userContext';
import { AdminApplicationListProps } from './AdminApplicationListProps';
import { Application } from '../../../../interfaces/Application';
import { useParams, useNavigate } from 'react-router-dom';
import Table from '../../../table/Table';
import { Column } from '../../../table/TableProps';
import ApplicationsController from '../../../../controllers/ApplicationsController';
import UserController from '../../../../controllers/UserController';
import { Applicant } from '../../../../interfaces/Applicant';

type TableData = [Application, Applicant];

const AdminApplicationList = ({}: AdminApplicationListProps) => {
    const { user, setUser } = useUserContext();
    const [ applications, setApplications ] = useState<Application[]>([]);
    const [ applicants, setApplicants ] = useState<Applicant[]>([]);
    const [ tableData, setTableData ] = useState<TableData[]>([]);
    const { organization } = useParams();
    const navigate = useNavigate();

    const applicantNotFound: Applicant = { id: '',
        firstName: 'Applicant',
        lastName: 'not found.',
        email: '',
    }

    const itemsPerPageOptions: number[] = [5,10,20,50,100];
    const columns: Column<TableData>[] = [
        {
            title: "Grant Titlte",
            format: (data: TableData) => data[0].grantTitle,
            sort: (data1: TableData, data2: TableData) => data1[0].grantTitle < data2[0].grantTitle ? -1 : 1,
        },
        {
            title: "Applicant",
            format: (data: TableData) => data[1].firstName + ' ' + data[1].lastName,
            sort: (data1: TableData, data2: TableData) => data1[1].firstName + data1[1].lastName < data2[1].firstName + data2[1].lastName ? -1 : 1,
        },
        {
            title: "Date",
            format: (data: TableData) => {
                return data[0].submissionDate.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                })
            },
            sort: (data1: TableData, data2: TableData) => Number(data1[0].submissionDate) - Number(data2[0].submissionDate),
        },
    ];

    const onApplicationRowClick = (data: TableData) => {
        navigate(`/application/${data[0].id}/review`);
    }

    useEffect(() => {
        // Redirect user if they are not apart of this org
        if (user) {
            if (user.organization !== organization) {
                navigate('/')
            }

            ApplicationsController.fetchOrgApplications(user).then((applications: Application[] | undefined) => {
                if (applications) {
                    setApplications(applications.map((application: Application) => {
                        return application;
                    }));
                } else {
                    // TODO: Display error message / popup
                    console.error("Failed getting admin applications");
                }
            });
        }

    }, [user, navigate]);

    useEffect(() => {
        UserController.fetchApplicants(applications.map((application: Application) => {
            return application.applicantID; 
        })).then((applicants: Applicant[]) => {
            setApplicants(applicants);
        });

    }, [applications]);

    useEffect(() => {
        if (applicants) {
            setTableData(applications.filter((app) => app.submitted).map((app: Application) => {
                return [app, applicants.find((applicant: Applicant) => applicant.id === app.applicantID) ?? applicantNotFound];
            }));
        }

    }, [applications, applicants]);

    return (
        <div className="flex flex-col h-full items-start justify-start px-5 bg-grantor-green">
            <span className="text-2xl pl-2">{organization} Grant Applications</span>
            <Table<TableData> items={tableData}
                   columns={columns}
                   itemsPerPageOptions={itemsPerPageOptions}
                   defaultIPP={10}
                   defaultSort={columns[2]}
                   onRowClick={onApplicationRowClick}
            />
        </div>
    );
};

export default AdminApplicationList;