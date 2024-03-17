import React, { useState } from 'react';
import { QuestionListProps } from "./GrantFormProps";
import { GrantQuestion } from "../../interfaces/Grant";
import { SERVER_PORT } from "../../constants/ServerConstants";
import { ApplicationStatus } from '../../interfaces/Application';

const GrantQuestionList = ({ user, grant }: QuestionListProps) => {
    const [questionList, setQuestionList] = useState<GrantQuestion[]>(grant.questions);

    const setAnswer = (index: number, answer: string) => {
        const newQuestionList = [...questionList];
        newQuestionList[index].answer = answer;
        
        setQuestionList(newQuestionList);
    }

    const getAnswers = () => {
        return questionList.map(function (question){
            return question.answer;
        });
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (!questionList) {
            return 
        }
        try {
            await fetch(`http://localhost:${SERVER_PORT}/submitApplication`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    
                    body: JSON.stringify({
                        userID: user.accountID,
                        grantID: grant.id,
                        grantTitle: grant.title,
                        grantCategory: grant.category,
                        submitted: true,
                        submissionDate: new Date(),
                        status: ApplicationStatus.submitted,
                        awarded: 0,
                        responses: getAnswers(),
                    })
                })
            .then(async (response) => {
                if (!response.ok) {
                    console.log("Server failed:", response.status)
                }
            })
        } catch (error) {
            console.log("Fetch function failed:", error)
        } 
    }

    return (
        <div>
            <form onSubmit={handleSubmit} id="grantform">
                {questionList.map((questionElement, index) => (
                    <li key={index}>
                         <div className="flex flex-row justify-between items-center">
                            <label>{questionElement.question}</label>
                            <input
                                type="text"
                                value={questionList[index].answer || ''}
                                placeholder="Type your answer here."
                                key={index}
                                onChange={(e) => setAnswer(index, e.target.value)}
                            />
                        </div>
                    </li>
                ))}
                <button type="submit">Submit Form</button>
            </form>
        </div>
    );
};

export default GrantQuestionList;