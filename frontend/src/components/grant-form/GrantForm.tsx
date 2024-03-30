import React, { useEffect, useState } from 'react';
import { GrantFormProps } from "./GrantFormProps";
import { GrantQuestion, GrantQuestionType } from "../../interfaces/Grant";
import { Application, ApplicationStatus } from '../../interfaces/Application';
import ApplicationsController from '../../controllers/ApplicationsController';
import { Link, useLocation } from 'react-router-dom';
import { Modal } from '../modal/Modal';
import { useNavigate, useParams } from 'react-router-dom';

import DropDown from '../displays/DropDown/DropDown';
import DropZoneFile from '../files/dropzone/DropZoneFile';
import { GrantQuestionFileType, GrantQuestionFileTypesToAccept } from '../files/FileUtils';
import FileController from '../../controllers/FileController';

const GrantForm = ({ user, grant }: GrantFormProps) => {
    const [questionList, setQuestionList] = useState<GrantQuestion[]>(grant.questions);
    const [uploadedFiles, setUploadedFiles] = useState<File[][]>([]);
    const [feedback, setFeedback] = useState<string>("");
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

        for (let i = 0; i < questionList.length; i++) {
            if (questionList[i].required && !questionList[i].answer) {
                setFeedback("All required questions must be answered.");
                return;
            }
        }

        uploadedFiles.map((files: File[], index) => {
            if (files?.length) {
                FileController.uploadFiles("question" + index, files, user).then((uploadedCount: number | undefined) => {
                    if (uploadedCount && uploadedCount < files.length) {
                        console.error("Error while uploading files");
                        return;
                    }
                });
            }
        });

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

    const handleFileUpload = (index: number, droppedFiles: File[]) => {
        const newQuestionList = [...questionList];
        newQuestionList[index].answer = droppedFiles.map((file) => file.name).join(',');
        setQuestionList(newQuestionList);

        const newUploadedFiles = [...uploadedFiles];
        newUploadedFiles[index] = [...uploadedFiles[index], ...droppedFiles];
        setUploadedFiles(newUploadedFiles);
    }

    const FileDisplay = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
        return (
            <button type='button' className='p-2 px-5 m-2 bg-secondary hover:bg-primary
                text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
                text-base' tabIndex={-1} {...props}>
                Add Files
            </button>
        )
    }

    return (
        <div className='py-10 flex justify-center'>
            <form onSubmit={handleSubmit} id="grantform" className=' border-4 bg-white lg:w-[70vw] w-[90vw]
            rounded-2xl border-primary shadow-2xl shadow-black p-6'>

                <h1 className='text-center font-bold text-2xl'>
                    Application Form
                </h1>

                <p>All questions marked with <span className='text-red-500'>*</span> are required.</p>

                {questionList.map((questionElement, questionIndex) => (
                    <li key={questionIndex} className='list-none'>
                         <div className="flex flex-col gap-1 p-5 px-3">
                            <h2 id={`question-${questionIndex}`} className='text-base'>
                                {questionElement.question}
                                {questionElement.required ? <span aria-label="required" className='text-red-500'>*</span> : ''}
                            </h2>
                            {
                                questionElement.type === GrantQuestionType.DROP_DOWN ? (
                                    <DropDown options={questionElement.options} 
                                              identity="Select Option" 
                                              selected={questionList[questionIndex].answer}
                                              selectCallback={(value: string) => setAnswer(questionIndex, value)}
                                              aria-labelledby={`question-${questionIndex}`}
                                              />
                                ) :
                                questionElement.type === GrantQuestionType.CHECKBOX ? (
                                    <div className="flex flex-row gap-2">
                                        {questionElement.options.map((option, optionIndex) => (
                                            <div key={optionIndex} className="flex flex-row items-center gap-2">
                                                <input type="checkbox" 
                                                    aria-labelledby={`question-${questionIndex}-option-${optionIndex}`}
                                                    value={option} 
                                                    checked={questionList[questionIndex].answer?.split(',').includes(option) || false}
                                                    onChange={(e) => {
                                                        const newAnswer = e.target.checked ? 
                                                            (questionList[questionIndex].answer ? questionList[questionIndex].answer + ',' + option : option) :
                                                            questionList[questionIndex].answer?.split(',').filter((item) => item !== option).join(',');
                                                        setAnswer(questionIndex, newAnswer ?? '');
                                                    }}
                                                    required={questionElement.required}
                                                    />
                                                <label id={`question-${questionIndex}-option-${optionIndex}`}>{option}</label>
                                            </div>
                                        ))}
                                    </div>
                                ) :
                                questionElement.type === GrantQuestionType.RADIO ? (
                                    <div className="flex flex-row gap-2">
                                        {questionElement.options.map((option, optionIndex) => (
                                            <div key={optionIndex} className="flex flex-row items-center gap-2">
                                                <input type="radio" 
                                                    aria-labelledby={`question-${questionIndex}-option-${optionIndex}`}
                                                    value={option} 
                                                    checked={questionList[questionIndex].answer === option}
                                                    onChange={(e) => setAnswer(questionIndex, option)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                          e.preventDefault(); // Prevent the form submission
                                                          setAnswer(questionIndex, option);
                                                        }
                                                      }}
                                                    required={questionElement.required}/>
                                                <label id={`question-${questionIndex}-option-${optionIndex}`}>{option}</label>
                                            </div>
                                        ))}
                                    </div>
                                ) :
                                questionElement.type === GrantQuestionType.FILE ?
                                <div className="flex flex-row justify-between w-full">
                                    <div className="flex flex-col max-h-40 overflow-y-auto">
                                    {
                                        uploadedFiles[questionIndex]?.length ?
                                        uploadedFiles[questionIndex].map((file, fileIndex) => (
                                            <div key={fileIndex} className="flex flex-row gap-2">
                                                <p className="block text-gray-700 font-semibold">{file.name}</p>
                                            </div>
                                        ))
                                        :
                                        <p className="block text-gray-700 font-semibold">'No files uploaded.'</p>
                                    }
                                    </div>
                                    <div aria-labelledby={`question-${questionIndex}`}>
                                        <DropZoneFile
                                            fileLimit={25}
                                            FileCallback={(droppedFiles) => handleFileUpload(questionIndex, droppedFiles)}
                                            dropZoneElement={<FileDisplay aria-labelledby={`question-${questionIndex}`}/>}
                                            acceptedFileTypes={GrantQuestionFileTypesToAccept(questionElement.options as GrantQuestionFileType[])}
                                        />
                                    </div>
                                </div>
                                : <textarea
                                    aria-labelledby={`question-${questionIndex}`}
                                    className='outline outline-2 p-3 pb-10 mt-3 ml-5 mr-5 rounded-md'
                                    value={questionList[questionIndex].answer || ''}
                                    placeholder="Type your answer here."
                                    key={questionIndex}
                                    onChange={(e) => setAnswer(questionIndex, e.target.value)}
                                />
                            }
                        </div>
                    </li>
                ))}
                {
                    feedback &&
                    <div className="flex flex-row justify-center">
                        <span className="text-red-500">{feedback}</span>
                    </div>
                }
                <div className="flex flex-row items-center justify-between">
                    
                    <Link to='/applications' tabIndex={-1}>
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