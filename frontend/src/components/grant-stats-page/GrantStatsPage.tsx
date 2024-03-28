import { useUserContext } from '../contexts/userContext';
import { useEffect, useState } from "react";
import { GrantStatsPageProps, TableValues } from "./GrantStatsPageProps";
import ApplicationsController from "../../controllers/ApplicationsController"
import { Application, ApplicationStatus } from "../../interfaces/Application";
import { Chart } from "react-google-charts";

const GrantStatsPage = ({}: GrantStatsPageProps) => {

    return <DisplayStats />;
};

const DisplayStats = () => {
    const {user} = useUserContext();
    const [applications, setApplications] = useState<Application[]>([]);
    const header = ["Category", "Frequency", { role: "style" }];
    const data = [
        ["Category", "Frequency", { role: "style" }],
        ["Charity", 2, "#blue"], 
        ["Government", 4, "#blue"],
        ["Development", 1, "#blue"],
        ["Miscellaneous", 0, "#blue"],
      ];

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
        }
    }

    useEffect(() => {
        if (user) {
            ApplicationsController.fetchUserApplications(user).then((applications: Application[]) => {
                setApplications(applications);
            });
            
        }
        console.log(applications);
    }, [user]);

    const grantCategoriesData = formatData(countCategories(applications), header);

    const grantValueData = formatData({
        "Applied": 0, 
        "Received": 0
    }, header)

    const grantStatusData = formatData({
        "Submitted": countApplicationsSubmitted(applications),
        "In Progress": countApplicationsInProgress(applications),
        "Resolved": countApplicationsResolved(applications),
        "Approved": countApplicationsApproved(applications),
        "Rejected": countApplicationsRejected(applications) 
    }, header);

    return(
        <div className=" bg-white m-20 rounded-xl border-4 border-primary shadow-2xl shadow-black h-fit"> 
            <div className="">
                <div className="m-10 text-center text-3xl">Grant Categories Breakdown</div>
                <Chart chartType="ColumnChart" width="100%" height="400px" data={grantCategoriesData} options={options} />
            </div>
            <div>
                <div className="m-10 text-center text-3xl">Total Grant Value Breakdown</div>
                <Chart chartType="ColumnChart" width="100%" height="400px" data={grantValueData} options={options} />
            </div>
            <div>
                <div className="m-10 text-center text-3xl">Grant Status Breakdown</div>
                <Chart chartType="ColumnChart" width="100%" height="400px" data={grantStatusData} options={options} />
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

const countApplicationStatus = (applications: Application[]) =>
{
    const result: TableValues = {};
    for (const application of applications)
    {
        result[application.status] = result[application.status] ? result[application.grantCategory] + 1 : 1;
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

const countApplications = (applications: Application[]) => applications.length;

const countApplicationsSubmitted = (applications: Application[]) => applications.filter((application) => application.status === ApplicationStatus.submitted).length;

const countApplicationsInProgress = (applications: Application[]) => applications.filter((application) => application.status === ApplicationStatus.inProgress).length;

const countApplicationsResolved = (applications: Application[]) => applications.filter((application) => application.status === ApplicationStatus.resolved).length;

const countApplicationsApproved = (applications: Application[]) => applications.filter((application) => application.status === ApplicationStatus.approved).length;

const countApplicationsRejected = (applications: Application[]) =>  applications.filter((application) => application.status === ApplicationStatus.rejected).length;

const countTotalAppliedAmount = (applications: Application[]) => applications.reduce((n, {awarded}) => n + awarded, 0);

const countTotalAwardedAmount = (applications: Application[]) => applications.filter((application) => application.status === ApplicationStatus.approved).reduce((n, {awarded}) => n + awarded, 0);

export default GrantStatsPage;