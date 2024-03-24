import React from 'react'
import { useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserContext } from '../contexts/userContext';
import { Grant, GrantQuestion } from '../../interfaces/Grant' 
import { GrantFormProps, GrantFormType } from './GrantFormProps';
import GrantsController from '../../controllers/GrantsController'

const GrantForm: React.FC<GrantFormProps> = ({ type }) => {

    const {user} = useUserContext();
    
    // extract the grantID from url
    const grantID = useParams()?.grantID ?? '';

    // default grant object
    const initialGrantState: Grant = {
        id: '',
        title: '',
        description: '',
        posted: new Date(),
        deadline: new Date(),
        minAmount: 0,
        maxAmount: 100000,
        organization: user?.organization ? user.organization : '',
        category: '',
        contact: '',
        questions: [],
        publish: false,
    };

    // set initial form to conform to default empty grant
    const [grant, setGrant] = useState<Grant>(initialGrantState);

    // function to retrieve a grant saved in the server, set the grant form to fill with the
    // requested grant
    const getSavedGrant = async(id: string) => {

        const grant: Grant | undefined = await GrantsController.fetchGrant(id);
        if (grant) {
            setGrant(grant);
        } else {
            console.error("error creating grant:");
            setFeedback("error creating grant");
        }
    }

    // retrieve the grant if in edit mode only when mounting
    useEffect(() => {
        if (type === GrantFormType.EDIT) {
            getSavedGrant(grantID)
        }

      }, []);

    
    // state variables
    const [question, setQuestion] = useState<string>('');
    const [feedback, setFeedback] = useState("");
    const navigate = useNavigate()
    
    // no user logged in or not admin
    if (!user || !user.isAdmin) {
        return (
            <div className='flex font-bold text-xl justify-center mt-10'>Access Denied: Invalid Permission</div>
        );
    };

    // not the owner of the grant
    if (grant.organization != user.organization) {
        return (
            <div className='flex font-bold text-xl justify-center mt-10'>
                Unauthorized: Permission Denied
            </div>
        );
    };

    // grant already published and cannot be editted
    if (grant.publish) {
        return (
            <div className='flex font-bold text-xl justify-center mt-10'>
                Bad Request: Grant Cannot Be Editted Once Published
            </div>)
    };

    // function to delete a grant in the server with given id
    const deleteGrant = async(id: string) => {
        GrantsController.deleteGrant(user, id).then((success: boolean) => {
            if (!success) {
                console.error('Failed to delete grant:');
                setFeedback('Failed to delete grant')
            }

            navigate('/')
        });
    };
    
    // handler for when a question is added in the form
    const handleQuestionSubmit = () => {
        if (question == '') return;

        let max = -1

        grant.questions.forEach((q) => {
            max = q['id'] > max ? q['id'] : max
        });

        const addQuestion = (prev: GrantQuestion[], newQuesion: string): GrantQuestion[] => {
            return [...prev, {id: max+1, question: newQuesion, answer: null}]
        };

        setGrant({ ...grant, questions: addQuestion(grant.questions, question)});
        setQuestion('');
    };

    // function to save grant when publish==false or publish grant otherwise
    const saveGrant = async(publish: boolean) => {
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
    };

    // when question input changes, update the question state
    const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = e.target;
        setQuestion(value)
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
            alert("At Least One Question Is Required To Be Published, Please Add A Custom Question")
            console.log("missing questions")
        } else {
            saveGrant(true)
            console.log('submitted')
        }
    };

    // formatter for dates
    const formatDateToYYYYMMDD = (date: Date) => {
        return new Date(date).toISOString().split('T')[0];
    };

    return (
        <div className="flex items-center justify-center min-h-screen pt-20">
            <div className="w-full max-w-2xl px-8 py-10 bg-white rounded-xl mt-10 mb-10 border-4 border-primary shadow-2xl shadow-black">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">{type === GrantFormType.CREATE ? 'Create a Grant': 'Edit Grant'}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Organization */}
                    <div>
                        <label htmlFor="organization" className="block text-gray-700 font-semibold mb-2">Organization</label>
                        <input type="text" name="organization" id="organization" value={grant.organization} onChange={handleInputChange} required
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
                            onChange={(e) => setGrant({ ...grant, deadline: new Date(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" />
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

                    <div className='mt-6'>
                        <label htmlFor="question" className="block text-gray-700 font-semibold mb-2">Add a Question for Applicants</label>

                        <div className='flex items-center'>
                            <input type="text" name="question" value={question} onChange={handleQuestionChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent mr-4" />
                            <button type='button' className='p-2 bg-green-600 text-white pl-5 pr-5 rounded-lg hover:bg-green-800' onClick={handleQuestionSubmit}>add</button>
                        </div>
                    </div>

                    {grant.questions && grant.questions.length > 0 && (
                        <div className='mt-6'>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Custom Questions</h3>
                            {grant.questions.map((question) => (
                                <div key={question.id} className="mb-4 flex justify-between p-2 border-gray-300 border items-center rounded-lg">
                                    <label htmlFor={`question-${question.id}`} className="block text-gray-700 font-semibold max-w-[80%]">
                                        {question.question}
                                    </label>
                                    <button type='button'className='text-[1rem] p-2 bg-red-500 text-white pl-5 pr-5 rounded-lg hover:bg-red-600' 
                                        onClick={() =>{ handleRemoveQuestion(question.id)} }>Remove</button>
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

export default GrantForm