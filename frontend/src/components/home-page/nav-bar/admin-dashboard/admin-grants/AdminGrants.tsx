
import { useState, useEffect } from 'react'
import { useUserContext } from '../../../../contexts/userContext'
import { Grant } from '../../../../../interfaces/Grant';
import { GrantItem } from '../../../../grant-list/GrantList';
import Tab from '../../../../tabs/Tab';
import { TabItem } from '../../../../tabs/TabProps';
import { Column } from '../../../../table/TableProps';
import Table from '../../../../table/Table';
import GrantsController from '../../../../../controllers/GrantsController';
import { useNavigate } from 'react-router-dom';

const AdminGrants = () => {
    // States and contexts
    const {user} = useUserContext();
    const [publishedGrants, setPublishedGrants] = useState<Grant[]>([]);
    const [unpublishedGrants, setUnpublishedGrants] = useState<Grant[]>([]);
    const [published, setPublished] = useState<boolean>(true);
    const navigate = useNavigate();

    const organization = user?.organization;

    // Tab
    const tabItems: TabItem[] = [
        {label: 'Published', callback: () => setPublished(true)},
        {label: 'Unpublished', callback: () => setPublished(false)}
    ];

    // Table
    const onGrantRowClick = (grant: Grant) => navigate(`/grants/${grant.id}`);
    const onSavedGrantRowClick = (grant: Grant) => navigate(`/editGrant/${grant.id}`);
    const itemsPerPageOptions: number[] = [5, 10];
    const columns: Column<Grant>[] = [
        {
            title: "Grant Title",
            format: (grant: Grant) => grant.title,
            sort: (grant1: Grant, grant2: Grant) => grant1.title < grant2.title ? -1 : 1,
        },
        {
            title: "Organization",
            format: (grant: Grant) => String(grant.organization),
            sort: (grant1: Grant, grant2: Grant) => grant1.organization < grant2.organization ? -1 : 1,
        },
        {
            title: "Category",
            format: (grant: Grant) => String(grant.category),
            sort: (grant1: Grant, grant2: Grant) => grant1.category < grant2.category ? -1 : 1,
        },
        {
            title: "Posted",
            format: (grant: Grant) => {
                return grant.posted.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                })
            },
            sort: (grant1: Grant, grant2: Grant) => Number(grant1.posted) - Number(grant2.posted),
        },
        {
            title: "Deadline",
            format: (grant: Grant) => {
                return grant.posted.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                })
            },
            sort: (grant1: Grant, grant2: Grant) => Number(grant1.deadline) - Number(grant2.deadline),
        },
        {
            title: "Min Award",
            format: (grant: Grant) => String(grant.minAmount),
            sort: (grant1: Grant, grant2: Grant) => Number(grant1.minAmount) - Number(grant2.minAmount),
        },
        {
            title: "Max Award",
            format: (grant: Grant) => String(grant.maxAmount),
            sort: (grant1: Grant, grant2: Grant) => Number(grant1.maxAmount) - Number(grant2.maxAmount),
        },
    ];

    useEffect(() => {
        // Fetch all grants created by the admin's organization
        if (organization){
            console.log("Fetching Admin Grants");
            GrantsController.fetchOrgGrants(organization).then((grants: Grant[]) => {
                setPublishedGrants(grants.filter((grant: Grant) => grant.publish));
                setUnpublishedGrants(grants.filter((grant: Grant) => !grant.publish));
            });
        }
    }, []);

    const NoGrantsDisplay = (): JSX.Element => {
        const status = published ? 'published' : 'unpublished';
        return (
            <div>
                <h1 className='text-xl text-white'>{`There are no ${status} grants.`}</h1>
            </div>
        );
    };

    const ShowPublishedGrants = (): JSX.Element => {
        return (
            <>
                {publishedGrants.length > 0 ? 
                <div className='flex flex-col h-full w-full items-start justify-start px-5'>
                    
                    <h1 className='text-white font-bold text-2xl ml-4 mb-4'>
                        Your Published Grants
                    </h1>

                    <h2 className='text-white font-semibold text-md mb-1 ml-2'>
                        click on grants to view details
                    </h2>

                    <Table items={publishedGrants}
                        columns={columns}
                        itemsPerPageOptions={itemsPerPageOptions}
                        defaultIPP={5}
                        defaultSort={columns[0]}
                        onRowClick={onGrantRowClick}
                    />
                </div>
                : (
                    <NoGrantsDisplay />
                )}
            </>
        );
    };

    const ShowUnpublishedGrants = (): JSX.Element => {
        return (
            <>
                {unpublishedGrants.length > 0 ?
                <div className='flex flex-col h-full w-full items-start justify-start px-5'>

                    <h1 className='text-white font-bold text-2xl ml-4 mb-4'>
                        Your Unpublished Grants
                    </h1>

                    <h2 className='text-white font-semibold text-md mb-1 ml-2'>
                        click on grants to edit and make changes
                    </h2>

                    <Table items={unpublishedGrants}
                    columns={columns}
                    itemsPerPageOptions={itemsPerPageOptions}
                    defaultIPP={5}
                    defaultSort={columns[0]}
                    onRowClick={onSavedGrantRowClick}
                    />
                </div>
                 : (
                    <NoGrantsDisplay />
                )}
            </>
        );
    };

    return (
        <div className='flex py-4 flex-col min-h-full min-w-full space-y-2 items-center px-20'>
            <div className='flex w-full justify-center align-middle p-4'>
                <div className='w-3/4'>
                    <Tab items={tabItems}/>
                </div>
            </div>
            <div className={`border-4 border-grey shadow-2xl shadow-black
            min-h-3/4 w-[90vw] p-6 bg-primary rounded-xl`}>
                {published ? ShowPublishedGrants() : ShowUnpublishedGrants()}
            </div>
        </div>
    );
};

export default AdminGrants
