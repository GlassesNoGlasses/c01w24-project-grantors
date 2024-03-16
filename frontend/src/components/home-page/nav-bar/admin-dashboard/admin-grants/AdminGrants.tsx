
import React, { useState } from 'react'
import { useUserContext } from '../../../../contexts/userContext'
import { Link } from 'react-router-dom';
import { Grant } from '../../../../../interfaces/Grant';
import { GrantItem } from '../../../../grant-list/GrantList';
import Tab from '../../../../tabs/Tab';
import { TabItem } from '../../../../tabs/TabProps';
import { Column } from '../../../../table/TableProps';
import Table from '../../../../table/Table';
import { LinkProps } from '../../../../../interfaces/LinkProps';
import { SERVER_PORT } from '../../../../../constants/ServerConstants';

const AdminGrants = () => {
    // States and contexts
    const {user} = useUserContext();
    const [publishedGrants, setPublishedGrants] = useState<Grant[]>([]);
    const [unpublishedGrants, setUnpublishedGrants] = useState<Grant[]>([]);
    const [published, setPublished] = useState<boolean>(true);

    const adminId = user?.accountID;

    // Tab
    const tabItems: TabItem[] = [
        {label: 'Published', callback: () => setPublished(true)},
        {label: 'Unpublished', callback: () => setPublished(false)}
    ];

    // Table
    const publishedLink: LinkProps<Grant> = {to: '/grants/', key: 'id'};
    const unPublished: LinkProps<Grant> = {to: '', key: 'id'};
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

    React.useEffect(() => {
        console.log("Fetching Admin Grants");
        fetchAdminGrants();
    }, []);

    React.useEffect(() => {
        console.log("Changes Occured");
        console.log(publishedGrants);
        console.log(unpublishedGrants);
        console.log(published);
    }, [publishedGrants, unpublishedGrants, published]);

    // Fetch all grants created by the admin with adminid
    const fetchAdminGrants = async () => {
        try {
            const response = await fetch(`http://localhost:${SERVER_PORT}/getAdminGrants/${adminId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            await response.json().then((data) => {
                const fetchedGrants: Grant[] = data['response'];
                console.log("Fetched Grants: ", fetchedGrants);

                const grants: Grant[] = fetchedGrants.map((grant: Grant) => {
                    return {...grant, deadline: new Date(grant.deadline), posted: new Date(grant.posted)}
                });

                setPublishedGrants(grants.filter((grant: Grant) => grant.publish));
                setUnpublishedGrants(grants.filter((grant: Grant) => !grant.publish));
            })
        } catch (error) {
            console.error('error creating grant:', (error as Error).message);
        }
    }

    const NoGrantsDisplay = (): JSX.Element => {
        const status = published ? 'published' : 'unpublished';
        return (
            <div>
                <h1 className='text-xl'>{`There are no ${status} grants.`}</h1>
            </div>
        )
    }

    const ShowPublishedGrants = (): JSX.Element => {
        return (
            <>
                {publishedGrants.length > 0 ? 
                <div className='flex flex-col h-full w-full items-start justify-start px-5'>
                    <Table items={publishedGrants}
                    columns={columns}
                    itemsPerPageOptions={itemsPerPageOptions}
                    defaultIPP={5}
                    defaultSort={columns[0]}
                    link={publishedLink}
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
                <div className='flex h-4/5 min-w-full justify-center align-middle overflow-auto'>
                    <div className='w-3/4 space-y-2'>
                        {unpublishedGrants.map((grant: Grant) => (
                            <GrantItem key={grant.id} grant={grant} link={`${grant.id}`} />
                        ))}
                    </div>
                </div>
                 : (
                    <NoGrantsDisplay />
                )}
            </>
        );
    };

  return (
    <div className='flex flex-col min-h-full min-w-full bg-grantor-green space-y-2'>
        <div className='flex w-full justify-center align-middle'>
            <div className='w-3/4'>
                <Tab items={tabItems}/>
            </div>
        </div>
        <div className='min-h-3/4 min-w-fit'>
            {published ? ShowPublishedGrants() : ShowUnpublishedGrants()}
        </div>
    </div>
  )
}

export default AdminGrants
