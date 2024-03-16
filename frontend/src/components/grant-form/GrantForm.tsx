import { Link, useParams } from "react-router-dom";
import React, { useState } from 'react';
import { QuestionListProps } from "./GrantFormProps";
import { Grant, GrantQuestion } from "../interfaces/Grant";
import { SERVER_PORT } from "../../constants/ServerConstants";

const GrantQuestionList = ({ username, grantId, questions }: QuestionListProps) => {
    const [questionList, setQuestionList] = useState(questions);

    const setAnswer = (index: number, answer: string) => {
        const newQuestionList = [...questionList];
        newQuestionList[index].answer = answer;
        
        setQuestionList(newQuestionList);
    }

    const getAnswers = (questions: GrantQuestion[]) => 
    {
        return questionList.map(function (obj){
            return obj.answer;
        });
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (!questionList ) {
            return 
        }
        try {
            await fetch(`http://localhost:${SERVER_PORT}/sendForm`,
                {method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                
                body: JSON.stringify({username: username, grantId: grantId, data: getAnswers(questionList)})} )
            .then(async (response) => {
                if (!response.ok) {
                    console.log("Serve failed:", response.status)
                } else {
                    await response.json().then((data) => {
                        //do nothing
                    }) 
                }
            })
        } catch (error) {
            console.log("Fetch function failed:", error)
        } 
    }

    return (
        <div>
            <form onSubmit={handleSubmit} id="grantform">
                {questions.map((questionElement, index) => (
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