import React, { useEffect, useState } from 'react';
import { GrantFormProps } from "./GrantFormProps";
import { GrantQuestion, GrantQuestionType } from "../../interfaces/Grant";
import { Application, ApplicationStatus } from '../../interfaces/Application';
import ApplicationsController from '../../controllers/ApplicationsController';
import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import DropDown from '../displays/DropDown/DropDown';
import DropZoneFile from '../files/dropzone/DropZoneFile';
import { Accept } from 'react-dropzone';
import { GrantQuestionFileType, GrantQuestionFileTypesToAccept } from '../files/FileUtils';
import FileController from '../../controllers/FileController';
import { upload } from '@testing-library/user-event/dist/upload';

const GrantForm = ({ user, grant }: GrantFormProps) => {
    const [questionList, setQuestionList] = useState<GrantQuestion[]>(grant.questions);
    const [uploadedFiles, setUploadedFiles] = useState<File[][]>([]);
    const navigate = useNavigate();
    const location = useLocation();

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
            navigate('/');
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (!questionList) {
            return 
        }

        uploadedFiles.map((files: File[], index) => {
            if (files.length) {
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
            navigate('/');
        });
    };

    const handleFileUpload = (index: number, droppedFiles: File[]) => {
        const newQuestionList = [...questionList];
        newQuestionList[index].answer = droppedFiles.map((file) => file.name).join(',');
        setQuestionList(newQuestionList);

        const newUploadedFiles = [...uploadedFiles];
        newUploadedFiles[index] = droppedFiles;
        setUploadedFiles(newUploadedFiles);
    }

    const FileDisplay = () => {
        return (
            <button type='button' className='p-2 px-5 m-2 bg-secondary hover:bg-primary
                text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
                text-base'>
                Add File(s)
            </button>
        )
    }

    return (
        <div className='pt-28 pb-20 flex justify-center'>
            <form onSubmit={handleSubmit} id="grantform" className=' border-4 bg-white lg:w-[70vw] w-[90vw]
            rounded-2xl border-primary shadow-2xl shadow-black p-6'>

                <div className='text-center font-bold text-2xl'>
                    Application Form
                </div>

                {questionList.map((questionElement, questionIndex) => (
                    <li key={questionIndex} className='list-none'>
                         <div className="flex flex-col gap-1 p-5 px-3">
                            <label id={`question-${questionIndex}`} className='text-base'>{questionElement.question}</label>
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
                                                    onChange={(e) => setAnswer(questionIndex, option)}/>
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
                                                <label className="block text-gray-700 font-semibold">{file.name}</label>
                                            </div>
                                        ))
                                        :
                                        <label className="block text-gray-700 font-semibold">'No files uploaded.'</label>
                                    }
                                    </div>
                                    <DropZoneFile
                                        aria-labelledby={`question-${questionIndex}`}
                                        fileLimit={25}
                                        FileCallback={(droppedFiles) => handleFileUpload(questionIndex, droppedFiles)}
                                        dropZoneElement={FileDisplay()}
                                        acceptedFileTypes={GrantQuestionFileTypesToAccept(questionElement.options as GrantQuestionFileType[])}
                                    />
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
        </div>
    );

};

export default GrantForm;