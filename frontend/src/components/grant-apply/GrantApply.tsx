import { useParams } from 'react-router-dom';
import { Grant } from "../../interfaces/Grant";
import { GrantApplyProps } from './GrantApplyProps';
import GrantForm from "../grant-form/GrantForm";
import { useUserContext } from '../contexts/userContext'
import GrantsController from '../../controllers/GrantsController';
import { useEffect, useState } from 'react';

const GrantApply = ({}: GrantApplyProps) => {

    const {user} = useUserContext();
    const {grantID} = useParams();
    const [grant, setGrant] = useState<Grant | undefined>(undefined);

    useEffect(() => {
        if (grantID) {
            GrantsController.fetchGrant(grantID).then((grant: Grant | undefined) => {
                if (grant) {
                    setGrant(grant);
                }
            });
        }
    }, []);

    const ErrorGrantQuestionList = () => {
        return <div>oh no! something went wrong</div>;
    }

    if (!user || !grant) {
        return <ErrorGrantQuestionList />;
    }

    return <GrantForm user={user} grant={grant}/>;
};

export default GrantApply;