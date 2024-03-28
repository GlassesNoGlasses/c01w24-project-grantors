import React, { useEffect, useState } from 'react';
import { GrantFormProps } from "./GrantFormProps";
import { GrantQuestion } from "../../interfaces/Grant";
import { Application, ApplicationStatus } from '../../interfaces/Application';
import ApplicationsController from '../../controllers/ApplicationsController';
import { Link, useLocation } from 'react-router-dom';
import { Modal } from '../modal/Modal';
import { useNavigate, useParams } from 'react-router-dom';


const GrantForm = ({ user, grant }: GrantFormProps) => {
    const [questionList, setQuestionList] = useState<GrantQuestion[]>(grant.questions);
    const navigate = useNavigate();
    const location = useLocation();

    
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showSaveModal, setShowSaveModal] = useState<boolean>(false);

    const handleCloseModalAndNavigate = () => {
        setShowModal(false);
        navigate('/');
    };

    const handleCloseModalAndNavigateSave = () => {
        setShowSaveModal(false);
        navigate('/');
    };

    const applicationIDParam = new URLSearchParams(location.search).get('applicationID');

    const setAnswer = (index: number, answer: string) => {
        const newQuestionList = [...questionList];
        newQuestionList[index].answer = answer;
        
        setQuestionList(newQuestionList);
    };

    useEffect(() => {
        if (applicationIDParam) {
            ApplicationsController.fetchApplication(applicationIDParam).then((application: Application | undefined) => {
                if (application) {
                    const newQuestionList = questionList.map((question: GrantQuestion) => {
                        if (application.responses) {
                            const response = application.responses.find((response) => response.question === question.question);
                            if (response) {
                                question.answer = response.answer;
                            }
                        }
                        return question;
                    });
                    setQuestionList(newQuestionList);
                }
            });
        }

    }, [applicationIDParam]);

    const handleSave = async () => {
        if (!questionList) {
            return 
        }

        ApplicationsController.submitApplication(user, {
            id: '',
            applicantID: user.accountID,
            grantID: grant.id,
            grantTitle: grant.title,
            grantCategory: grant.category,
            submitted: true,
            submissionDate: new Date(),
            status: ApplicationStatus.inProgress,
            awarded: 0,
            responses: questionList,
            milestones: grant.milestones,
        }).then(() => {
            setShowSaveModal(true);
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (!questionList) {
            return 
        }

        ApplicationsController.submitApplication(user, {
            id: '',
            applicantID: user.accountID,
            grantID: grant.id,
            grantTitle: grant.title,
            grantCategory: grant.category,
            submitted: true,
            submissionDate: new Date(),
            status: ApplicationStatus.submitted,
            awarded: 0,
            responses: questionList,
            milestones: grant.milestones,
        }).then(() => {
            setShowModal(true);
        });
    };

    return (
        <div className='pt-28 pb-20 flex justify-center'>
            <form onSubmit={handleSubmit} id="grantform" className=' border-4 bg-white lg:w-[70vw] w-[90vw]
            rounded-2xl border-primary shadow-2xl shadow-black p-6'>

                <div className='text-center font-bold text-2xl'>
                    Application Form
                </div>

                {questionList.map((questionElement, index) => (
                    <li key={index} className='list-none'>
                         <div className="flex flex-col gap-1 p-5 px-3">
                            <label className='text-base'>{questionElement.question}</label>
                            <textarea
                                className='outline outline-2 p-3 pb-10 mt-3 ml-5 mr-5 rounded-md'
                                value={questionList[index].answer || ''}
                                placeholder="Type your answer here."
                                key={index}
                                onChange={(e) => setAnswer(index, e.target.value)}
                            />
                        </div>
                    </li>
                ))}
                <div className="flex flex-row items-center justify-between">
                    
                    <Link to='/applications'>
                        <button 
                            className='p-2 px-5 m-7 mr-1 bg-red-500 hover:bg-red-600 active:bg-red-700
                            text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
                            text-lg' 
                            type='button' 
                            name="back">
                            Back
                        </button>
                    </Link>
                    
                    
                    <div>
                        <button 
                            className='p-2 px-5 m-7 mr-1 bg-secondary hover:bg-[#0bb4d6]
                            text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
                            text-lg' 
                            type='button' 
                            name="save"
                            onClick={handleSave}>
                            Save
                        </button>
                    </div>
                    
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
            <Modal showModal={showModal} closeModal={handleCloseModalAndNavigate} openModal={() => setShowModal(true)}>
			<div className='flex h-[100vh] w-[100vw] justify-center items-center'>
				<div className='bg-white h-fit w-2/5 border-4 border-blue-400 border-solid rounded-lg'>
					<div className='h-full w-full'>
						<p className='text-xl text-center font-semibold'>
							{`You have successfully submitted the grant.`}
						</p>
						<div className='flex flex-row justify-center'>
							<button className='p-2 px-5 m-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700
								text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
								text-base text-center justify-center align-middle flex pb-1'
								onClick={handleCloseModalAndNavigate}>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
		</Modal>
        <Modal showModal={showSaveModal} closeModal={handleCloseModalAndNavigateSave} openModal={() => setShowSaveModal(true)}>
			<div className='flex h-[100vh] w-[100vw] justify-center items-center'>
				<div className='bg-white h-fit w-2/5 border-4 border-blue-400 border-solid rounded-lg'>
					<div className='h-full w-full'>
						<p className='text-xl text-center font-semibold'>
							{`You have successfully saved the grant.`}
						</p>
						<div className='flex flex-row justify-center'>
							<button className='p-2 px-5 m-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700
								text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
								text-base text-center justify-center align-middle flex pb-1'
								onClick={handleCloseModalAndNavigateSave}>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
		</Modal>
        </div>
    );

};

export default GrantForm;