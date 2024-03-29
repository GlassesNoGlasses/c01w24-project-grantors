
import React, { useState } from 'react'
import { MessageFormProps } from './MessageFormProps'
import { Modal } from '../../modal/Modal'
import { Message } from '../../../interfaces/Message'
import DropdownText from '../../filter/TextDropFilter'
import DropZoneFile from '../../files/dropzone/DropZoneFile'
import { GrantQuestionFileType, GrantQuestionFileTypesToAccept } from '../../files/FileUtils'
import MessageController from '../../../controllers/MessageController'
import { useUserContext } from '../../contexts/userContext'
import FileController from '../../../controllers/FileController'

export const MessageForm = ({
    title,
    showModal,
    callbackOpen,
    callbackClose,
    setCreatedMessage,
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
    read: false,
    fileNames: []
  };

  const [message, setMessage] = useState<Message>(emptyMessage);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const {user} = useUserContext();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user || !user.email) {
      return;
    }

    message.fileNames = uploadedFiles.map((file) => {return file.name});

    FileController.uploadFiles(message.title, uploadedFiles, user).then((response: number | undefined) => {
      if (!response) {
        console.error("Error while uploading files");
        return;
      }
    })

    MessageController.sendMessage(message, user).then((response: boolean) =>  {
      if (setCreatedMessage) {
        response ? setCreatedMessage(true) : setCreatedMessage(false);
      }
      callbackClose();
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
      rounded-2xl border-primary shadow-2xl shadow-black p-6 gap-4 flex flex-col'>
        <div className='text-center font-bold text-2xl'>
          {title}
        </div>

        <div className='flex flex-col'>
          <label htmlFor="title" className='font-bold'>Title:</label>
          <input type="text" id="title" name="title"
          onChange={(e) => setMessage({...message, title: e.target.value})}
          className=' border-2 border-gray-500 rounded-md focus:border-black p-2'
          required/>
        </div>

        <div className='flex flex-col'>
          <label htmlFor="description" className='font-bold'>Description:</label>
          <input type="text" id="description" name="description"
          onChange={(e) => setMessage({...message, description: e.target.value})}
          className='border-2 border-gray-500 rounded-md focus:border-black p-2'
          required/>
        </div>

        {receiverEmail ? 
          <p className=' border-2 p-2 rounded-md border-gray-500'>
            {`To: ${receiverEmail}`}
          </p>
        :
          <DropdownText
          label={"Search for Receiver Email:"}
          options={applicantEmails}
          onSelect={(option) => setMessage({...message, receiverEmail: option})}
          />
        }

        <div className="flex flex-row justify-between w-full items-center">
            <div className="flex flex-col max-h-40 overflow-y-auto">
            {
              uploadedFiles.length ?
              uploadedFiles.map((file, fileIndex) => (
                  <div key={fileIndex} className="flex flex-row gap-2">
                      <label className="block text-gray-700 font-semibold">{file.name}</label>
                  </div>
              ))
              :
              <label className="flex text-gray-700 font-semibold text-base">'No files uploaded.'</label>
            }
            </div>
            <DropZoneFile
            fileLimit={10}
            acceptedFileTypes={GrantQuestionFileTypesToAccept([GrantQuestionFileType.ANY])}
            FileCallback={(droppedFiles) => setUploadedFiles(droppedFiles)}
            dropZoneElement={FileElement()}
            />
        </div>

        <div className='flex justify-between'>

          <button
            className='p-2 px-5 m-7 mr-14 bg-blue-500 hover:bg-blue-600 active:bg-blue-700
            text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
            text-base text-center justify-center align-middle'
            onClick={callbackClose}>
						Close
					</button>

          <button 
            className='p-2 px-5 m-7 mr-14 bg-green-500 hover:bg-green-600 active:bg-green-700
            text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
            text-lg' 
            type="submit" 
            name="submit">
            Submit
          </button>

        </div>
      </form>
    </Modal>
  )
}

