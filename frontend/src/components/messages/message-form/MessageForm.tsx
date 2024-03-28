
import React, { useState } from 'react'
import { MessageFormProps } from './MessageFormProps'
import { Modal } from '../../modal/Modal'
import { Message } from '../../../interfaces/Message'
import { Link } from 'react-router-dom'

export const MessageForm = ({
    showModal,
    callbackOpen,
    callbackClose,
    senderEmail,
    receiverEmail,
    applicantEmails
}: MessageFormProps) => {

  const emptyMessage: Message = {
    title: "",
    senderEmail: senderEmail,
    receiverEmail: receiverEmail ? receiverEmail : "",
    dateSent: new Date(),
    description: "",
    Files: [],
  };

  const [message, setMessage] = useState<Message>(emptyMessage);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

};

  return (
    <Modal showModal={showModal} closeModal={callbackClose} openModal={callbackOpen}>
      <form onSubmit={handleSubmit} id="messageForm"
      className='border-4 bg-white lg:w-[70vw] w-[90vw]
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
    </Modal>
  )
}

