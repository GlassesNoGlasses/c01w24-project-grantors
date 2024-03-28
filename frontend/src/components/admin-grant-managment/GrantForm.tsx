import React from 'react'
import { useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserContext } from '../contexts/userContext';
import { Grant, GrantMilstone, GrantQuestion } from '../../interfaces/Grant' 
import { GrantFormProps, GrantFormType } from './GrantFormProps';
import GrantsController from '../../controllers/GrantsController'
import { Trash } from 'heroicons-react';
import { Modal } from '../modal/Modal';



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
        milestones: [],
        publish: false,
    };

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
    const [milestoneFeedback, setMilestoneFeedback] = useState("");
    const navigate = useNavigate();
    const [milestone, setMilestone] = useState<GrantMilstone>({
        id: '0',
        title: '',
        description: '',
        dueDate: new Date(),
        completed: false,
        evidence: ''
    });
    
    
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

    const setMilestoneTitle = (title: string) => {
        setMilestone({...milestone, title: title});
    }

    const setMilestoneDescription = (description: string) => {
        setMilestone({...milestone, description: description});
    }

    const setMilestoneDueDate = (dueDate: Date) => {
        setMilestone({...milestone, dueDate: dueDate});
    }

    const handleMilestoneSubmit = () => {
        if (milestone.title == '') {
            setMilestoneFeedback('Title is required');
            return;
        }

        if (milestone.description == '') {
            setMilestoneFeedback('Description is required');
            return;
        }

        setMilestoneFeedback('');

        const max = Math.max(0, ...grant.milestones.map(m => Number(m.id)));

        const addMilestone = (prev: GrantMilstone[], newMilestone: GrantMilstone): GrantMilstone[] => {
            return [...prev, {id: String(max + 1), title: newMilestone.title, description: newMilestone.description, dueDate: newMilestone.dueDate, completed: false, evidence: ''}]
        };

        setGrant({ ...grant, milestones: addMilestone(grant.milestones, milestone)});
        setMilestone({id: '0', title: '', description: '', dueDate: new Date(), completed: false, evidence: ''});
    }

    const handleRemoveMilestone = (id: string) => {
        setGrant({ ...grant, milestones: grant.milestones.filter(m => m.id != id)});
    }

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
                        setShowModal(true);
                    } else {
                        setShowSaveModal(true);
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
                    
                    {/* Questions */}
                    <div className='mt-6'>
                        <label htmlFor="question" className="block text-gray-700 font-semibold mb-2">Add a Question for Applicants</label>

                        <div className='flex items-center'>
                            <input type="text" name="question" value={question} onChange={handleQuestionChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent mr-4" />
                            <button type='button' className='p-2 bg-green-600 text-white pl-5 pr-5 rounded-lg hover:bg-green-800' onClick={handleQuestionSubmit}>Add</button>
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
                                    <button type='button'className='text-[1rem] p-2 bg-min-500 text-white pl-5 pr-5 rounded-lg hover:bg-red-600' 
                                        onClick={() =>{ handleRemoveQuestion(question.id)} }>Remove</button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Milestones */}
                    <div className='border-2 border-primary rounded-md bg-magnify-light-blue p-4 px-5'>
                        <h3 className="text-base text-gray-700 font-semibold mb-2">Milestones</h3>
                        <div className='flex flex-col gap-4'>
                            <div>
                                <label htmlFor="milestoneTitle" className="block text-gray-700 font-semibold mb-2">Title</label>
                                <input type="text" name="milestoneTitle" id="milestoneTitle" value={milestone.title} onChange={(e) => setMilestoneTitle(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" />
                            </div>
                            <div>
                                <label htmlFor="milestoneDescription" className="block text-gray-700 font-semibold mb-2">Description</label>
                                <textarea name="milestoneDescription" id="milestoneDescription" value={milestone.description} onChange={(e) => setMilestoneDescription(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" rows={3}></textarea>
                            </div>
                            <div>
                                <label htmlFor="milestoneDueDate" className="block text-gray-700 font-semibold mb-2">Due Date</label>
                                <input type="date" name="milestoneDueDate" id="milestoneDueDate" value={formatDateToYYYYMMDD(milestone.dueDate)}
                                    min={today}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        const newDate = newValue ? new Date(newValue) : new Date(); // Fallback to current date if empty
                                        setMilestoneDueDate(newDate);
                                    }}                            
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" />
                            </div>
                            <button type='button'
                                    className='p-2 bg-green-600 text-white px-5 rounded-lg hover:bg-green-800'
                                    onClick={handleMilestoneSubmit}>
                                Add Milstone
                            </button>
                            {milestoneFeedback && <div className='text-sm text-red-600'>{milestoneFeedback}</div>}
                        </div>
                    </div>

                    {grant.milestones && grant.milestones.length > 0 && (
                        <div className='flex flex-col gap-4'>
                            <h3 className="text-lg font-semibold text-gray-800">Milestones</h3>
                            <div className='flex flex-col gap-6'>
                                {grant.milestones.map((milestone) => (
                                    <div key={milestone.id}
                                        className='p-2 px-4 border-2 border-magnify-dark-blue rounded-md
                                                   flex flex-col gap-2 relative group'>
                                        <h4 className='text-xl'>{milestone.title}</h4>
                                        <p className='text-sm'>Due: {formatDateToYYYYMMDD(milestone.dueDate)}</p>
                                        <p className='text-base'>{milestone.description}</p>
                                        <Trash className='absolute text-magnify-dark-blue top-2 right-2 w-6 h-6 cursor-pointer invisible group-hover:visible'
                                               onClick={() => handleRemoveMilestone(milestone.id)}/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {feedback && <div className='flex justify-center items-center'>{feedback}</div>}

        
                    <div className={`flex ${type === GrantFormType.CREATE ? 'justify-end' : 'justify-between'} gap-8 `}>
                        {type === GrantFormType.CREATE ? <></> : <button type='button' className='p-2 bg-red-600 text-white pl-5 pr-5 rounded-lg hover:bg-red-800' onClick={() => deleteGrant(grantID)}>Delete</button>}
                        <div className='flex justify-end'>
                            <button type='button' className='p-2 bg-secondary text-white pl-5 pr-5 rounded-lg hover:bg-primary mr-10' onClick={() => saveGrant(false)}>Save</button>
                            <button type='submit' className='p-2 bg-green-600 text-white pl-5 pr-5 rounded-lg hover:bg-green-800'>Publish</button>
                        </div>
                    </div>
                   
                </form>
            </div>
            <Modal showModal={showModal} closeModal={handleCloseModalAndNavigate} openModal={() => setShowModal(true)}>
			<div className='flex h-[100vh] w-[100vw] justify-center items-center'>
				<div className='bg-white h-fit w-2/5 border-4 border-blue-400 border-solid rounded-lg'>
					<div className='h-full w-full'>
						<p className='text-xl text-center font-semibold'>
							{`You have successfully created the grant.`}
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

export default GrantForm