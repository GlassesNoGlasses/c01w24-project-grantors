import { useParams } from 'react-router-dom';
import { Grant, GrantQuestion } from "../interfaces/Grant";
import  { getGrant } from "../grant-page/GrantPage";
import { GrantPageApplyProps } from './GrantPageApplyProps';
import GrantForm from "../grant-form/GrantForm";
import { useUserContext } from '../contexts/userContext'

const GrantPageApply = ({}: GrantPageApplyProps) => {

    const {user, setUser} = useUserContext();
    const {grantId} = useParams();
    const questions: undefined | GrantQuestion[] = getQuestions(grantId);
    
    return questions === undefined ? <ErrorGrantQuestionList /> : <GrantForm username={user?.username} grantId={grantId} questions={questions}/>;
};

const getQuestions = (grantId: String | undefined) => {

    const grant: Grant | undefined = getGrant(grantId);
    
    return grant === undefined ? undefined : grant.questions;
}

const ErrorGrantQuestionList = () => {
    return <div>oh no! something went wrong</div>;
}

export default GrantPageApply;