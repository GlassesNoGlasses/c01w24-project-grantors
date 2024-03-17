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
                    <li key={index} className='list-none'>
                         <div className="flex flex-row justify-between items-center">
                            <label className='text-base'>{questionElement.question}</label>
                            <textarea
                                className='outline outline-2 p-1 pb-10 mt-3 ml-5 mr-5'
                                value={questionList[index].answer || ''}
                                placeholder="Type your answer here."
                                key={index}
                                onChange={(e) => setAnswer(index, e.target.value)}
                            />
                        </div>
                    </li>
                ))}
                <div className="flex flex-row items-center justify-end">
                    <button 
                        className='p-2 px-5 m-7 mr-1 bg-red-500 hover:bg-red-600 active:bg-red-700
                        text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
                        text-lg' 
                        type='submit' 
                        name="cancel">
                        Cancel
                    </button>
                    
                    <button 
                        className='p-2 px-5 m-7 mr-1 bg-green-500 hover:bg-green-600 active:bg-green-700
                        text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
                        text-lg' 
                        type='submit' 
                        name="save">
                        Save
                    </button>
                    
                    <button 
                        className='p-2 px-5 m-7 mr-14 bg-green-500 hover:bg-green-600 active:bg-green-700
                        text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
                        text-lg' 
                        type="submit" 
                        name="submit">
                        Submit Form
                    </button>
                    
                </div>
            </form>
        </div>
    );
};

export default GrantQuestionList;