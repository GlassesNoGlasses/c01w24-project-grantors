import React, { useState } from 'react';
import { Grant, GrantQuestion } from '../interfaces/Grant';

// const initialQuestions: GrantQuestion[] = [
//     { id: 1, question: "What is the primary goal of your project?", answer: null },
//     { id: 2, question: "How will you measure the success of your project?", answer: null }
// ];

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setGrant({ ...grant, [name]: value });
    };

    const handleAmountChange = (name: 'minAmount' | 'maxAmount', value: number) => {
        setGrant({ ...grant, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Grant Application</h2>
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
                    {grant.questions && grant.questions.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Questions</h3>
                            {grant.questions.map((question) => (
                                <div key={question.id} className="mb-4">
                                    <label htmlFor={`question-${question.id}`} className="block text-gray-700 font-medium mb-2">
                                        {question.question}
                                    </label>
                                    <input 
                                        type="text" 
                                        id={`question-${question.id}`}
                                        name={`question-${question.id}`}
                                        value={question.answer || ''}
                                        onChange={(e) => handleQuestionChange(question.id, e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required 
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default GrantForm;