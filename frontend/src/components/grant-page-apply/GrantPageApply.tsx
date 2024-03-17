import { useParams } from 'react-router-dom';
import { Grant, GrantQuestion } from "../../interfaces/Grant";
import { GrantPageApplyProps } from './GrantPageApplyProps';
import GrantForm from "../grant-form/GrantForm";
import { useUserContext } from '../contexts/userContext'
import { fetchGrant } from '../../controllers/GrantsController';
import { useEffect, useState } from 'react';

const GrantPageApply = ({}: GrantPageApplyProps) => {

    const {user, setUser} = useUserContext();
    const {grantId} = useParams();
    const [ questions, setQuestions] = useState<GrantQuestion[]>([]);

    useEffect(() => {
        if (grantId) {
            getQuestions(grantId).then((grantQuestions: GrantQuestion[] | undefined) => {
                if (grantQuestions) {
                    setQuestions(grantQuestions);
                }
            })
        }
    }, []);

    const getQuestions = async (grantId: String): Promise<GrantQuestion[] | undefined> => {

        const grant: Grant | undefined = await fetchGrant(grantId);

        return grant ? grant.questions : undefined;
    }

    const ErrorGrantQuestionList = () => {
        return <div>oh no! something went wrong</div>;
    }

    return questions.length === 0 ? <ErrorGrantQuestionList /> : <GrantForm username={user?.username} grantId={grantId} questions={questions}/>;
};

export default GrantPageApply;