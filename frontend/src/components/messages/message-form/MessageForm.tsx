
import React, { useState } from 'react'
import { MessageFormProps } from './MessageFormProps'
import { Modal } from '../../modal/Modal'
import { Message } from '../../../interfaces/Message'
import DropdownText from '../../filter/TextDropFilter'

export const MessageForm = ({
    showModal,
    callbackOpen,
    callbackClose,
    senderEmail,
    receiverEmail,
    applicantEmails
}: MessageFormProps) => {

  const emptyMessage: Message = {
    id: "",
    title: "",
    senderEmail: senderEmail,
    receiverEmail: receiverEmail ? receiverEmail : "",
    dateSent: new Date(),
    description: "",
    Files: [],
  };

  const testEmails: String[] = ["ok@gmail.com", "loster@hotmaik.com"];

  const [message, setMessage] = useState<Message>(emptyMessage);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log(message)
};

  return (
    <Modal showModal={showModal} closeModal={callbackClose} openModal={callbackOpen}>
      <form onSubmit={handleSubmit} id="messageForm"
      className='border-4 bg-white lg:w-[70vw] w-[90vw]
      rounded-2xl border-primary shadow-2xl shadow-black p-6'>
        <div className='text-center font-bold text-2xl'>
          Message Form
        </div>

        <div className='flex flex-col'>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title"
          onChange={(e) => setMessage({...message, title: e.target.value})}
          className=' border-2 border-black'/>
        </div>

        <div className='flex flex-col'>
          <label htmlFor="description">Description:</label>
          <input type="text" id="description" name="description"
          onChange={(e) => setMessage({...message, description: e.target.value})}
          className=' border-2 border-black'/>
        </div>

        <DropdownText
        label={"Select an Applicant Email"}
        options={testEmails}
        onSelect={(option) => setMessage({...message, receiverEmail: option})}/>

        <button 
            className='p-2 px-5 m-7 mr-14 bg-green-500 hover:bg-green-600 active:bg-green-700
            text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
            text-lg' 
            type="submit" 
            name="submit">
            Submit Form
        </button>
      </form>
    </Modal>
  )
}

