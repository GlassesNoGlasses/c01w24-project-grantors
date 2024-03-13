import React, { useState } from 'react';
import { QuestionListProps } from "./GrantQuestionListProps";
import { GrantQuestion } from "../interfaces/Grant";

const GrantQuestionList = ({ questions }: QuestionListProps) => {
    return (
        <div>
            {questions.map((question, index) => (
                <li key={index}>
                    <QuestionItem grantQuestion={question} />
                </li>
            ))}
        </div>
    );
};

const QuestionItem = ({grantQuestion}: {grantQuestion: GrantQuestion}) => {
    const [answer, setInputValue] = useState('');

    return( 
        <div className="flex flex-row justify-between items-center">
            <h1 className="text-2xl font-bold">{grantQuestion.question}</h1>
            <input
                type="text"
                value={answer}
                placeholder="Type your answer here."
                onChange={(e) => setInputValue(e.target.value)}
            />
         </div>
    );
}




export default GrantQuestionList;