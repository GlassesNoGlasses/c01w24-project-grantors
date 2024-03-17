import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GrantFormProps } from "./GrantFormProps";

const SERVER_PORT:number = 8000;

const GrantForm = ({ username, grantId, questions }: GrantFormProps) => {
    const [questionList, setQuestionList] = useState(questions);
    const navigate = useNavigate();

    const setAnswer = (index: number, answer: string) => {
        const newQuestionList = [...questionList];
        newQuestionList[index].answer = answer;
        
        setQuestionList(newQuestionList);
    }

    const getAnswers = () => 
    {
        return questionList.map(function (obj){
            return obj.answer;
        });
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const name = (event.nativeEvent as any).submitter.name;
        if ( name === "submit"){
            if (!questionList ) {
                return 
            }
            try {
                await fetch(`http://localhost:${SERVER_PORT}/sendForm`,
                    {method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    
                    body: JSON.stringify({username: username, grantId: grantId, data: getAnswers()})} )
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

            navigate('/grants');
        }
        else if (name === "cancel"){
            navigate('/grants');
        }
        else if (name === "save"){
            //add code for save here
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} id="grantform" className='m-5 ml-10 mr-10'>
                {questions.map((questionElement, index) => (
                    <li key={index} className='list-none'>
                         <div className="flex flex-col gap-1 p-5 px-3">
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

export default GrantForm;