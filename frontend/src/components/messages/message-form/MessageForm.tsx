
import React, { useState } from 'react'
import { MessageFormProps } from './MessageFormProps'
import { Modal } from '../../modal/Modal'
import { Message } from '../../../interfaces/Message'
import { User } from '../../../interfaces/User'
import DropdownText from '../../filter/TextDropFilter'
import DropZoneFile from '../../files/dropzone/DropZoneFile'
import { GrantQuestionFileType, GrantQuestionFileTypesToAccept } from '../../files/FileUtils'
import MessageController from '../../../controllers/MessageController'
import { useUserContext } from '../../contexts/userContext'

export const MessageForm = ({
    title,
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
  };

  const [message, setMessage] = useState<Message>(emptyMessage);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const {user} = useUserContext();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user || !user.email) {
      return;
    }

    MessageController.sendMessage(message, user).then((response) =>  {
      if (response) {
        console.log("Message sent successfully.");
      } else {
        console.log("Failed to send message.");
      }
    })
  };

  const FileElement  = (): JSX.Element => {
    return (
      <button type='button' className='p-2 px-5 m-2 bg-secondary hover:bg-primary
          text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
          text-base'>
          Add File(s)
      </button>
    )
  }

  return (
    <Modal showModal={showModal} closeModal={callbackClose} openModal={callbackOpen}>
      <form onSubmit={handleSubmit} id="messageForm"
      className='border-4 bg-white lg:w-[70vw] w-[90vw]
      rounded-2xl border-primary shadow-2xl shadow-black p-6'>
        <div className='text-center font-bold text-2xl'>
          {title}
        </div>

        <div className='flex flex-col'>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title"
          onChange={(e) => setMessage({...message, title: e.target.value})}
          className=' border-2 border-black'
          required/>
        </div>

        <div className='flex flex-col'>
          <label htmlFor="description">Description:</label>
          <input type="text" id="description" name="description"
          onChange={(e) => setMessage({...message, description: e.target.value})}
          className=' border-2 border-black'
          required/>
        </div>

        <DropdownText
        label={"Search for Receiver Email:"}
        options={applicantEmails}
        onSelect={(option) => setMessage({...message, receiverEmail: option})}
        />

        <div className="flex flex-row justify-between w-full">
            <div className="flex flex-col max-h-40 overflow-y-auto">
            {
              uploadedFiles.length ?
              uploadedFiles.map((file, fileIndex) => (
                  <div key={fileIndex} className="flex flex-row gap-2">
                      <label className="block text-gray-700 font-semibold">{file.name}</label>
                  </div>
              ))
              :
              <label className="block text-gray-700 font-semibold text-2xl">'No files uploaded.'</label>
            }
            </div>
            <DropZoneFile
            fileLimit={10}
            acceptedFileTypes={GrantQuestionFileTypesToAccept([GrantQuestionFileType.ANY])}
            FileCallback={(droppedFiles) => setUploadedFiles(droppedFiles)}
            dropZoneElement={FileElement()}
            />
        </div>

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

