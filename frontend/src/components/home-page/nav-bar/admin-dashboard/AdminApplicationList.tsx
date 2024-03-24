import { useEffect, useState } from 'react';
import { useUserContext } from '../../../contexts/userContext';
import { AdminApplicationListProps } from './AdminApplicationListProps';
import { Application, ApplicationStatus } from '../../../../interfaces/Application';
import { useParams, useNavigate } from 'react-router-dom';
import Table from '../../../table/Table';
import { Column } from '../../../table/TableProps';
import ApplicationsController from '../../../../controllers/ApplicationsController';
import UserController from '../../../../controllers/UserController';
import { Applicant } from '../../../../interfaces/Applicant';
import SearchFilter from '../../../filter/SearchFilter';
import DateRangeFilter from '../../../filter/DateRangeFilter';

type TableData = [Application, Applicant];

const AdminApplicationList = ({}: AdminApplicationListProps) => {
    const { user, setUser } = useUserContext();
    const [ applications, setApplications ] = useState<Application[]>([]);
    const [ applicants, setApplicants ] = useState<Applicant[]>([]);
    const [ tableData, setTableData ] = useState<TableData[]>([]);
    const [ filteredTableData, setFilteredTableData ] = useState<TableData[]>([]);
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
            title: "Submission Date",
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
        <div className="pt-28 p-4">
            <div className="flex flex-col h-full items-start justify-start p-6
                bg-primary rounded-2xl border-4 border-white shadow-2xl shadow-black">
                <span className="text-2xl text-white mb-4">{organization} Grant Applications</span>
                {
                    tableData.length === 0 ?
                    <div className="flex flex-row justify-center items-center w-full h-full">
                        <span className="text-white text-lg">You have no applications.</span>
                    </div>
                    :
                    <div className="flex flex-row w-full gap-4">
                        <TableFilter tableData={tableData} setTableData={setFilteredTableData}/>
                        <Table<TableData> items={filteredTableData}
                            columns={columns}
                            itemsPerPageOptions={itemsPerPageOptions}
                            defaultIPP={10}
                            defaultSort={columns[2]}
                            onRowClick={onApplicationRowClick}
                        />
                    </div>
                }
            </div>
        </div>
    );
};

const TableFilter = ({ tableData, setTableData }: {
    tableData: TableData[],
    setTableData: (tableData: TableData[]) => void,
}) => {
    const [ grantTitle, setGrantTitle ] = useState<string>("");
    const [ submitted, setSubmitted ] = useState<(Date | null)[]>([]);
    const [ applicant, setApplicant ] = useState<string>("");

    const statusDropDownOptions = Object.values(ApplicationStatus);

    useEffect(() => {
        setTableData(tableData.filter(row => {
            if (grantTitle && !row[0].grantTitle.toLowerCase().includes(grantTitle.toLowerCase()))
                return false;
            if (applicant && !(row[1].firstName + row[1].lastName).toLowerCase().includes(applicant))
                return false;
            if (submitted[0] !== null && row[0].submissionDate < submitted[0])
                return false;
            if (submitted[1] !== null&& row[0].submissionDate > submitted[1])
                return false;

            return true;
        }));

    }, [grantTitle, submitted, applicant]);

    const onSubmittedFilterChange = (dateRange: (Date | null)[]) => {
        setSubmitted(dateRange);
    };

    return (
        <div className="flex flex-col gap-1 lg:w-1/3">
            <h1 className="text-lg text-white">Application Filter</h1>
            <SearchFilter className="text-white" label="Grant Title" setFilter={setGrantTitle}/>
            <SearchFilter className="text-white" label="Applicant" setFilter={setApplicant}/>
            <DateRangeFilter className="text-white" label="Submission Date" rangeStartLabel="Submitted After" rangeEndLabel="Submitted Before" setFilter={onSubmittedFilterChange} />
        </div>
    );
};

export default AdminApplicationList;