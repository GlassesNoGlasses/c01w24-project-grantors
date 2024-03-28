import React from 'react'
import { useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserContext } from '../contexts/userContext';
import { Grant, GrantQuestion, GrantQuestionType } from '../../interfaces/Grant' 
import { GrantFormProps, GrantFormType } from './GrantFormProps';
import GrantsController from '../../controllers/GrantsController'
import DropDown from '../displays/DropDown/DropDown';

// default grant object
const initialGrantState: Grant = {
    id: '',
    title: '',
    description: '',
    posted: new Date(),
    deadline: new Date(),
    minAmount: 0,
    maxAmount: 100000,
    organization: '',
    category: '',
    contact: '',
    questions: [],
    publish: false,
};

const initalNewQuestion: GrantQuestion = {
    id: -1,
    question: '',
    answer: '',
    type: GrantQuestionType.NULL,
    options: [],
}


const GrantForm: React.FC<GrantFormProps> = ({ type }) => {
    const {user} = useUserContext();
    // state variables
    const [newQuestion, setNewQuestion] = useState<GrantQuestion>(initalNewQuestion);
    const [feedback, setFeedback] = useState("");
    const [unauthorized, setUnauthorized] = useState(false);
    const navigate = useNavigate()
    
    const grantID = useParams()?.grantID ?? '';
    const [grant, setGrant] = useState<Grant>(initialGrantState);

    const questionTypes = [ GrantQuestionType.TEXT,
                            GrantQuestionType.CHECKBOX,
                            GrantQuestionType.DROP_DOWN, 
                            GrantQuestionType.RADIO
    ];

    // retrieve the grant if in edit mode only when mounting
    useEffect(() => {
        if (type === GrantFormType.EDIT) {
            GrantsController.fetchGrant(grantID).then((grant: Grant | undefined) => {
                if (grant) {
                    setGrant(grant);
                } else {
                    console.error("Error creating grant:");
                    setFeedback("Error creating grant");
                }
            });
        }

      }, []);

    useEffect(() => {
        if (!user || !user.isAdmin) {
            setUnauthorized(true);
        } else if (type === GrantFormType.EDIT && grant.organization != user?.organization) {
            setUnauthorized(true);
        } else {
            // Type is create, or user is admin or organization matches
            initialGrantState.organization = user?.organization ?? '';
            setGrant(initialGrantState);
            setUnauthorized(false);
        }
    }, [user]);

    // function to delete a grant in the server with given id
    const deleteGrant = async(id: string) => {
        if (user) {
            GrantsController.deleteGrant(user, id).then((success: boolean) => {
                if (!success) {
                    console.error('Failed to delete grant:');
                    setFeedback('Failed to delete grant')
                }
    
                navigate('/')
            });
        }
    };
    
    // handler for when a question is added in the form
    const handleQuestionSubmit = () => {
        if (newQuestion.question == '') return;

        let max = -1

        grant.questions.forEach((question: GrantQuestion) => {
            max = question.id > max ? question.id : max
        });

        let questionOptionsCleaned = newQuestion.options.filter((option) => option != '');
        if (newQuestion.type == GrantQuestionType.DROP_DOWN ||
            newQuestion.type == GrantQuestionType.RADIO) {
            if (questionOptionsCleaned.length < 2) {
                setFeedback('At least two options are required for multiple choice or checkbox questions');
                return;
            }
        } else if (newQuestion.type == GrantQuestionType.CHECKBOX) {
            if (questionOptionsCleaned.length < 1) {
                setFeedback('At least one option is required for checkbox questions');
                return;
            }
        }

        setGrant({ ...grant, questions: [...grant.questions, {...newQuestion, id: max+1, options: questionOptionsCleaned}]});
        // Keep the type for the next question
        setNewQuestion({...initalNewQuestion, type: newQuestion.type});
    };

    // function to save grant when publish==false or publish grant otherwise
    const saveGrant = async(publish: boolean) => {
        if (user) {
            if (type === GrantFormType.CREATE){
                GrantsController.createGrant(user, {...grant, publish: publish}).then((grantID: string | undefined) => {
                    if (grantID) {
                        setGrant(initialGrantState);
                        if (publish) {
                            setFeedback('Grant Published!');
                        } else {
                            setFeedback('Grant Saved!')
                        }
                    } else {
                        setFeedback('Error creating grant')
                    }
                });
            } else if (type === GrantFormType.EDIT) {
                GrantsController.saveGrant(user, {...grant, publish: publish}).then((success: boolean) => {
                    if (success) {
                        if (publish) {
                            navigate('/admin/grants');
                        } else {
                            setFeedback('Grant Saved!');
                        }
                    } else {
                        console.error('Failed to save grant');
                        setFeedback('Error saving grant');
                    }
                });
            }
        }
    };

    // when question input changes, update the question state
    const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = e.target;

        setNewQuestion({...newQuestion, question: value});
    };

    // remove a question by filtering it out
    const handleRemoveQuestion = (id: number) => {
        setGrant({ ...grant, questions: grant.questions.filter(q => q.id != id)})
    };

    // when general input changes, update the corresponding field
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setGrant({ ...grant, [name]: value });
        setFeedback('')
    };

    // when amount input changes, update the corresponding field
    const handleAmountChange = (name: 'minAmount' | 'maxAmount', value: number) => {
        setGrant({ ...grant, [name]: value });
    };

    // handle when the form is published when all required fields are provided
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (grant.questions.length == 0) {
            setFeedback("At Least One Question Is Required To Be Published, Please Add A Custom Question")
        } else {
            saveGrant(true)
        }
    };

    const handleQuestionTypeChange = (selected: string) => {
        if (!selected) {
            selected = GrantQuestionType.NULL;
        }
        setNewQuestion({
            ...newQuestion, 
            type: selected as GrantQuestionType,
            options: [],
        });
    };

    // handle when a multiple choice answer is changed
    const handleAnswerChoicesChange = (index: number, value: string) => {
        if (newQuestion.options) {
            const newOptions = newQuestion.options.map((option, i) => {
                return i == index ? value : option
            });
            setNewQuestion({...newQuestion, options: newOptions});
        }
    }

    // formatter for dates
    const formatDateToYYYYMMDD = (date: Date) => {
        return new Date(date).toISOString().split('T')[0];
    };

    if (unauthorized) {
        return (
            <div className='flex font-bold text-xl justify-center mt-10'>Access Denied: Invalid Permission</div>
        );
    };

    // grant already published and cannot be editted
    if (grant.publish) {
        return (
            <div className='flex font-bold text-xl justify-center mt-10'>
                Bad Request: Grant Cannot Be Editted Once Published
            </div>
        );
    };
    const today = formatDateToYYYYMMDD(new Date());

    return (
        <div className="flex items-center justify-center min-h-screen pt-20">
            <div className="w-full max-w-2xl px-8 py-10 bg-white rounded-xl mt-10 mb-10 border-4 border-primary shadow-2xl shadow-black">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">{type === GrantFormType.CREATE ? 'Create a Grant': 'Edit Grant'}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Organization */}
                    <div>
                        <label htmlFor="organization" className="block text-gray-700 font-semibold mb-2">Organization</label>
                        <input type="text" name="organization" id="organization" value={grant.organization} onChange={handleInputChange} required readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" />
                    </div>
                    
                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block text-gray-700 font-semibold mb-2">Category</label>
                        <input type="text" name="category" id="category" value={grant.category} onChange={handleInputChange} required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" />
                    </div>
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">Title</label>
                        <input type="text" name="title" id="title" value={grant.title} onChange={handleInputChange} required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" />
                    </div>
                    
                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">Description</label>
                        <textarea name="description" id="description" value={grant.description} onChange={handleInputChange} required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" rows={3}></textarea>
                    </div>
                    
                    {/* Deadline */}
                    <div>
                        <label htmlFor="deadline" className="block text-gray-700 font-semibold mb-2">Deadline</label>
                        <input type="date" name="deadline" id="deadline" value={formatDateToYYYYMMDD(grant.deadline)}
                            min={today}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                const newDate = newValue ? new Date(newValue) : new Date(); // Fallback to current date if empty
                                setGrant({ ...grant, deadline: newDate });
                            }}                            
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>
                    
                    {/* Contact */}
                    <div>
                        <label htmlFor="contact" className="block text-gray-700 font-semibold mb-2">Contact</label>
                        <input type="text" name="contact" id="contact" value={grant.contact} onChange={handleInputChange} required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" />
                    </div>
                    
                    {/* Min Amount */}
                    <div>
                        <label htmlFor="minAmount" className="block text-gray-700 font-semibold mb-2">Min Amount (USD)</label>
                        <input type="number" name="minAmount" id="minAmount" min="0" value={grant.minAmount.toString()}
                            onChange={(e) => handleAmountChange('minAmount', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" />
                    </div>
                    
                    {/* Max Amount */}
                    <div>
                        <label htmlFor="maxAmount" className="block text-gray-700 font-semibold mb-2">Max Amount (USD)</label>
                        <input type="number" name="maxAmount" id="maxAmount" min={grant.minAmount.toString()} value={grant.maxAmount.toString()}
                            onChange={(e) => handleAmountChange('maxAmount', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" />
                    </div>

                    {/* Questions */}
                    <div className='mt-6'>
                        <label htmlFor="question" className="block text-gray-700 font-semibold mb-2">Add a Question for Applicants</label>

                        <div className="flex flex-col items-start">
                            <div className='flex flex-row items-center gap-4 w-full'>
                                {
                                    newQuestion.type != GrantQuestionType.NULL ?
                                    <>
                                    <input type="text" name="question" value={newQuestion.question} onChange={handleQuestionChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" />
                                    <button type='button' className='py-2 bg-green-600 text-white pl-5 pr-5 rounded-lg hover:bg-green-800' onClick={handleQuestionSubmit}>add</button>
                                    </>
                                    : <></>
                                }
                                <DropDown options={questionTypes} identity="Question Type" selectCallback={handleQuestionTypeChange}/>
                            </div>
                            { // special question options
                                newQuestion.type == GrantQuestionType.DROP_DOWN ||
                                newQuestion.type == GrantQuestionType.CHECKBOX ||
                                newQuestion.type == GrantQuestionType.RADIO ?
                                <div className="flex flex-col gap-2">
                                    <span className="block text-gray-700 font-semibold">Question Options</span>
                                    {
                                        newQuestion.options.map((option, index) => (
                                            <input key={index} type="text" name={`answer-option-${index}`} value={option} onChange={(e) => handleAnswerChoicesChange(index, e.target.value)}
                                                className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" />
                                        ))
                                    }
                                    <button type='button' onClick={() => setNewQuestion({...newQuestion, options: [...newQuestion.options, '']})} className='py-2 bg-green-600 text-white pl-5 pr-5 rounded-lg hover:bg-green-800'>Add Answer Option</button>
                                </div>
                                :
                                <></>
                            }
                        </div>
                    </div>

                    {grant.questions && grant.questions.length > 0 && (
                        <div className='mt-6'>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Custom Questions</h3>
                            {grant.questions.map((question) => (
                                <div key={question.id} className="mb-4 flex flex-col justify-between p-2 border-gray-300 border items-center rounded-lg">
                                    <div className="flex flex-row justify-between w-full items-center">
                                        <label htmlFor={`question-${question.id}`} className="block text-gray-700 font-semibold max-w-[80%]">
                                            {question.question}
                                        </label>
                                        <button type='button'className='text-[1rem] p-2 bg-red-500 text-white pl-5 pr-5 rounded-lg hover:bg-red-600'
                                            onClick={() =>{ handleRemoveQuestion(question.id)} }>Remove</button>
                                    </div>
                                    <div className='flex flex-row w-full gap-3'>
                                        {
                                            question.type == GrantQuestionType.CHECKBOX ?
                                                question.options.map((option, index) => (
                                                    <div key={index} className='flex flex-row items-center gap-1'>
                                                        <input type='checkbox' name={`question-${question.id}`} value={option} />
                                                        <label htmlFor={`question-${question.id}`} className="block text-gray-700 font-semibold">
                                                            {option}
                                                        </label>
                                                    </div>
                                                ))
                                            : question.type == GrantQuestionType.DROP_DOWN ?
                                                <DropDown options={question.options} identity="Select Option"/>
                                            : question.type == GrantQuestionType.RADIO ?
                                                question.options.map((option, index) => (
                                                    <div key={index} className='flex flex-row items-center gap-1'>
                                                        <input type='radio' name={`question-${question.id}`} value={option} />
                                                        <label htmlFor={`question-${question.id}`} className="block text-gray-700 font-semibold">
                                                            {option}
                                                        </label>
                                                    </div>
                                            )) : <></>
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className='h-[40px] flex justify-center items-center'>{feedback}</div>

        
                    <div className={`flex ${type === GrantFormType.CREATE ? 'justify-end' : 'justify-between'} gap-8 `}>
                        {type === GrantFormType.CREATE ? <></> : <button type='button' className='p-2 bg-red-600 text-white pl-5 pr-5 rounded-lg hover:bg-red-800' onClick={() => deleteGrant(grantID)}>Delete</button>}
                        <div className='flex justify-end'>
                            <button type='button' className='p-2 bg-secondary text-white pl-5 pr-5 rounded-lg hover:bg-primary mr-10' onClick={() => saveGrant(false)}>Save</button>
                            <button type='submit' className='p-2 bg-green-600 text-white pl-5 pr-5 rounded-lg hover:bg-green-800'>Publish</button>
                        </div>
                    </div>
                   
                </form>
            </div>
        </div>
    );
};

export default GrantForm;