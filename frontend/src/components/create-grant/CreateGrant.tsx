import React from 'react'
import { useState } from 'react';
import { Grant, GrantQuestion } from '../interfaces/Grant' 

let ID = 0
const SERVER_PORT = 8000

const GrantForm: React.FC = () => {
    const initialGrantState: Grant = {
        id: Date.now(),
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
        publish: false
    };

    const [grant, setGrant] = useState<Grant>(initialGrantState);
    const [question, setQuestion] = useState<string>('');
    const [feedback, setFeedback] = useState<string>("");

    const handleQuestionSubmit = () => {
        const addQuestion = (prev: GrantQuestion[], newQuesion: string): GrantQuestion[] => {
            return [...prev, {id: ID++, question: newQuesion, answer: null}]
        }

        setGrant({ ...grant, questions: addQuestion(grant.questions, question)});
        setQuestion('')
    };

    const saveGrant = async() => {
        try {
            const response = await fetch(`http://localhost:${SERVER_PORT}/createGrant`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 'title': grant.title, 'description': grant.description, 'deadline': grant.deadline, 
                'minAmount': grant.minAmount, "maxAmount": grant.maxAmount, 'organization': grant.organization,
                'category': grant.category, "contact": grant.contact, 'questions': grant.questions, }),
            });
        
            
            console.log('Successfully saved grant');
            setFeedback(`Successfully saved grant`);
            
        
          } catch (error) {
            console.error('error creating grant:', (error as Error).message);
            setFeedback(`error creating grant`)
          }
    }

    const handleQChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setQuestion(value)
    };

    const handleRemoveQuestion = (id: number) => {
        setGrant({ ...grant, questions: grant.questions.filter(q => q.id != id)})
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setGrant({ ...grant, [name]: value });
    };

    const handleAmountChange = (name: 'minAmount' | 'maxAmount', value: number) => {
        setGrant({ ...grant, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('submitted')
    };

    const handleQuestionChange = (id: number, answer: string) => {
        const updatedQuestions = grant.questions.map(q => 
            q.id === id ? { ...q, answer } : q
        );
        setGrant({ ...grant, questions: updatedQuestions });
    };

    const formatDateToYYYYMMDD = (date: Date) => {
        return new Date(date).toISOString().split('T')[0];
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-2xl px-8 py-10 bg-white shadow-lg rounded-xl">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Create a Grant</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Organization */}
                    <div>
                        <label htmlFor="organization" className="block text-gray-700 font-medium mb-2">Organization</label>
                        <input type="text" name="organization" id="organization" value={grant.organization} onChange={handleInputChange} required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>
                    
                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block text-gray-700 font-medium mb-2">Category</label>
                        <input type="text" name="category" id="category" value={grant.category} onChange={handleInputChange} required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
                        <input type="text" name="title" id="title" value={grant.title} onChange={handleInputChange} required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>
                    
                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description</label>
                        <textarea name="description" id="description" value={grant.description} onChange={handleInputChange} required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" rows={4}></textarea>
                    </div>
                    
                    {/* Deadline */}
                    <div>
                        <label htmlFor="deadline" className="block text-gray-700 font-medium mb-2">Deadline</label>
                        <input type="date" name="deadline" id="deadline" value={formatDateToYYYYMMDD(grant.deadline)}
                            onChange={(e) => setGrant({ ...grant, deadline: new Date(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>
                    
                    {/* Contact */}
                    <div>
                        <label htmlFor="contact" className="block text-gray-700 font-medium mb-2">Contact</label>
                        <input type="text" name="contact" id="contact" value={grant.contact} onChange={handleInputChange} required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>
                    
                    {/* Min Amount */}
                    <div>
                        <label htmlFor="minAmount" className="block text-gray-700 font-medium mb-2">Min Amount (USD)</label>
                        <input type="number" name="minAmount" id="minAmount" min="0" value={grant.minAmount.toString()}
                            onChange={(e) => handleAmountChange('minAmount', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>
                    
                    {/* Max Amount */}
                    <div>
                        <label htmlFor="maxAmount" className="block text-gray-700 font-medium mb-2">Max Amount (USD)</label>
                        <input type="number" name="maxAmount" id="maxAmount" min={grant.minAmount.toString()} value={grant.maxAmount.toString()}
                            onChange={(e) => handleAmountChange('maxAmount', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>

                    <div className='mt-6'>
                        <label htmlFor="question" className="block text-gray-700 font-medium mb-2">Add a Question for Applicants</label>

                        <div className='flex items-center'>
                            <input type="text" name="question" value={question}  required onChange={handleQChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mr-4" />
                            <button type='button' className='p-2 bg-green-600 text-white pl-5 pr-5 rounded-lg hover:bg-green-800' onClick={handleQuestionSubmit}>add</button>
                        </div>
                    </div>

                    {grant.questions && grant.questions.length > 0 && (
                        <div className='mt-6'>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Custom Questions</h3>
                            {grant.questions.map((question) => (
                                <div key={question.id} className="mb-4 flex justify-between p-2 border-gray-300 border items-center rounded-lg">
                                    <label htmlFor={`question-${question.id}`} className="block text-gray-700 font-medium max-w-[80%]">
                                        {question.question}
                                    </label>
                                    <button type='button'className='text-[1rem] p-2 bg-red-500 text-white pl-5 pr-5 rounded-lg hover:bg-red-600' 
                                        onClick={() =>{ handleRemoveQuestion(question.id)} }>Remove</button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className='flex justify-between gap-8 mt-10'>
                        <button type='button' className='p-2 bg-red-600 text-white pl-5 pr-5 rounded-lg hover:bg-red-800' onClick={() => console.log('deleted')}>Delete</button>
                        <div className='flex justify-end'>
                            <button type='button' className='p-2 bg-blue-600 text-white pl-5 pr-5 rounded-lg hover:bg-blue-800 mr-10' onClick={saveGrant}>Save</button>
                            <button type='submit' className='p-2 bg-green-600 text-white pl-5 pr-5 rounded-lg hover:bg-green-800'>Publish</button>
                        </div>
                    </div>
                </form>
                
            </div>
        </div>
    );
}



const CreateGrant = () => {
  return (
    <GrantForm />
  )
}

export default CreateGrant