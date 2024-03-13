import { useParams } from 'react-router-dom';
import { Grant, GrantQuestion } from "../interfaces/Grant";
import  { getGrant } from "../grant-page/GrantPage";
import { GrantPageApplyProps } from './GrantPageApplyProps';
import GrantQuestionList from "../grant-question-list/GrantQuestionList";

const GrantPageApply = ({}: GrantPageApplyProps) => {

    const {grantId} = useParams();
    const questions: undefined | GrantQuestion[] = getQuestions(grantId);
    return questions === undefined ? <ErrorGrantQuestionList /> : <GrantQuestionList questions={questions}/>;
};

const ErrorGrantQuestionList = () => {
    return <div>oh no! something went wrong</div>
}

const getQuestions = (grantId: String | undefined) => {

    const grant: Grant | undefined = getGrant(grantId);
    return grant === undefined ? undefined : grant.questions;
}

export default GrantPageApply;