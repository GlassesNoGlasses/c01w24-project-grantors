import { useParams } from 'react-router-dom';
import { Grant, GrantQuestion } from "../interfaces/Grant";
import  { getGrant } from "../grant-page/GrantPage";
import { GrantPageApplyProps, GrantQuestionFormProps } from './GrantPageApplyProps';
import GrantQuestionList from "../grant-question-list/GrantQuestionList";

const GrantPageApply = ({}: GrantPageApplyProps) => {

    const {grantId} = useParams();
    const questions: undefined | GrantQuestion[] = getQuestions(grantId);
    return questions === undefined ? <ErrorGrantQuestionForm /> : <GrantQuestionForm questions={questions}/>;
};

const ErrorGrantQuestionForm = () => {
    //form has no questions?
    return <div>oh no! something went wrong</div>;
}

const GrantQuestionForm = ({questions}: GrantQuestionFormProps) => {
    return( 
        <form onSubmit={handleSubmit}>
            <GrantQuestionList questions={questions}/>
            <button type="submit" className="submit-btn">Submit Form</button>
        </form>
    )
}

const getQuestions = (grantId: String | undefined) => {

    const grant: Grant | undefined = getGrant(grantId);
    return grant === undefined ? undefined : grant.questions;
}

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
}

export default GrantPageApply;