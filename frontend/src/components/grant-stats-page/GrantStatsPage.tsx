import { useUserContext } from '../contexts/userContext';
import { useEffect, useState } from "react";
import { GrantStatsPageProps, TableValues } from "./GrantStatsPageProps";
import ApplicationsController from "../../controllers/ApplicationsController"
import { Application, ApplicationStatus } from "../../interfaces/Application";
import { Chart } from "react-google-charts";
import {User} from '../../interfaces/User'

const GrantStatsPage = ({}: GrantStatsPageProps) => {
    const { user } = useUserContext();
    return user?.isAdmin ? <AdminDisplayStats /> : <DisplayStats />;
};

interface DisplayStatsProps {
    optionalUser? : User
}

const AdminDisplayStats = () => {
    return(
        <div>

        </div>
    )
}

const DisplayStats = ({optionalUser} : DisplayStatsProps) => {
    const {user} = useUserContext();
    const [applications, setApplications] = useState<Application[]>([]);
    const header = ["Category", "Frequency", { role: "style" }];

    const options = {
        'fontName': 'SF-Compact-Rounded-Regular',
        'backgroundColor': 'transparent',
        'tooltip' : {
            trigger: 'none'
          },
        'vAxis': {
            gridlines: {
                color: 'transparent'
            },
            textPosition: 'none',
            baselineColor: '#000000'
          },
        'legend': {
            position: 'none'
        },
    }

    useEffect(() => {
        if (user) {
            ApplicationsController.fetchUserApplications(user).then((applications: Application[]) => {
                setApplications(applications);
            });
        }
        
        if (optionalUser) {
            ApplicationsController.fetchUserApplications(optionalUser).then((applications: Application[]) => {
                setApplications(applications);
            });
        }
    }, [user, optionalUser]);

    const grantsApplied = countTotalAppliedAmount(applications);
    const grantsAwarded = countTotalAwardedAmount(applications);

    const grantValueData = formatData({
        [`Applied Amount: ${grantsApplied}`]: grantsApplied, 
        [`Received Amount: ${grantsAwarded}`]: grantsAwarded
    }, header)

    const grantCategoriesData = formatData(countCategories(applications), header);

    const applicationsSubmitted = countApplicationsSubmitted(applications);
    const applicationsInProgress = countApplicationsInProgress(applications);
    const applicationsResolved = countApplicationsResolved(applications);
    const applicationsApproved = countApplicationsApproved(applications);
    const applicationsRejected = countApplicationsRejected(applications);

    const grantStatusData = formatData({
        [`Submitted: ${applicationsSubmitted}`]: applicationsSubmitted,
        [`In Progress: ${applicationsInProgress}`]: applicationsInProgress,
        [`Resolved: ${applicationsInProgress}`]: applicationsResolved,
        [`Approved: ${applicationsApproved}`]: applicationsApproved,
        [`Rejected: ${applicationsRejected}`]: applicationsRejected
    }, header);

    return(
        <div className='overflow-auto py-10 px-20 h-[90vh]'>
            <div className=" bg-white  rounded-xl border-4 border-primary shadow-2xl shadow-black"> 
                <div className="flex items-center">
                    <div className="m-10 text-center text-3xl">Total Grant Funding Received</div>
                    <div className="m-10 text-center text-3xl">${grantsAwarded}</div>
                    <Chart chartType="ColumnChart" width="100%" height="400px" data={grantValueData} options={options} />
                </div>
                
                <div className="flex items-center">
                    <div className="m-10 ml-20 text-center text-3xl">Grant Categories Breakdown</div>
                    <Chart chartType="ColumnChart" width="100%" height="400px" data={grantCategoriesData} options={options} />
                </div>
                
                <div className="flex items-center">
                    <div className="m-10 text-center text-3xl">Grant Status Breakdown</div>
                    <Chart chartType="ColumnChart" width="100%" height="400px" data={grantStatusData} options={options} />
                </div>
            </div>
        </div>   
    );
}

const countCategories = (applications: Application[]) => 
{
    const result: TableValues = {};
    for (const application of applications)
    {
        result[application.grantCategory] = result[application.grantCategory] ? result[application.grantCategory] + 1 : 1;
    }
    return result;
}

const formatData = (values: TableValues, header: any[]) =>
{

    let result: (string | number)[][] = [];
    result.push(header)
    for (const key in values)
    {
        let arr: (string | number)[] = [];
        
        arr.push(key);
        arr.push(values[key]);
        arr.push("black");
        result.push(arr);
    }

    return result

}

const countApplicationsSubmitted = (applications: Application[]) => applications.filter((application) => application.status === ApplicationStatus.submitted).length;

const countApplicationsInProgress = (applications: Application[]) => applications.filter((application) => application.status === ApplicationStatus.inProgress).length;

const countApplicationsResolved = (applications: Application[]) => applications.filter((application) => application.status === ApplicationStatus.resolved).length;

const countApplicationsApproved = (applications: Application[]) => applications.filter((application) => application.status === ApplicationStatus.approved).length;

const countApplicationsRejected = (applications: Application[]) =>  applications.filter((application) => application.status === ApplicationStatus.rejected).length;

const countTotalAppliedAmount = (applications: Application[]) => applications.filter((application) => application.status != ApplicationStatus.rejected).reduce((n, {awarded}) => n + awarded, 0);

const countTotalAwardedAmount = (applications: Application[]) => applications.filter((application) => application.status === ApplicationStatus.approved).reduce((n, {awarded}) => n + awarded, 0);

export {GrantStatsPage, DisplayStats};