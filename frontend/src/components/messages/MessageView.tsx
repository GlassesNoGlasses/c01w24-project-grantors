
import React, { useEffect, useState } from 'react'
import { MessageViewProps } from './MessageViewProps'
import { useParams } from 'react-router-dom';
import { Message } from '../../interfaces/Message';
import MessageController from '../../controllers/MessageController';
import { useUserContext } from '../contexts/userContext';
import UserController from '../../controllers/UserController';
import { User } from '../../interfaces/User';
import FileController from '../../controllers/FileController';
import { FSFile } from '../../interfaces/FSFile';
import { DownloadWrapper } from '../files/download/DownloadWrapper';
import { MessageForm } from './message-form/MessageForm';

export const MessageView = ({}: MessageViewProps) => {
  const { messageID } = useParams();
  const [message, setMessage] = useState<Message | undefined>(undefined);
  const [messageFiles, setMessageFiles] = useState<FSFile[]>([]);
  const {user} = useUserContext();

  useEffect(() => {
    if (!messageID || !user) {
      return;
    }

    MessageController.fetchMessage(messageID).then((message: Message | undefined) => {
        if (!message) return;

        UserController.fetchMessageSender(message, user).then((sender: User | undefined) => {
            if (!sender) return;

            if (sender.isAdmin && sender.organization) {
                FileController.fetchOrgFSFiles(sender.organization).then((files:  FSFile[] | undefined) => {
                    if (files) {
                        setMessageFiles(files?.filter((file: FSFile) => message.fileNames.includes(file.title)));
                    }
                })
            } else if (!sender.isAdmin) {
                FileController.fetchUserFSFiles(sender.accountID).then((files: FSFile[] | undefined) => {
                    if (files) {
                        setMessageFiles(files?.filter((file: FSFile) => message.fileNames.includes(file.title)));
                    }
                })
            }
        })

        setMessage(message);
    });


  }, []);
  
  return (message && user?.email) ? 
  <MessageDisplay message={message} files={messageFiles} userEmail={user.email.toString()}/>
  : <MessageNotFound />;
}

const MessageNotFound = () => {
    return (
        <div className="flex flex-col gap-3 p-1 px-3">
            <h1 className="text-4xl font-bold">Message Not Found</h1>
            <p className="text-base">The message you are looking for does not exist.</p>
        </div>
    );
};

const MessageDisplay = ({message, files, userEmail}: {message: Message, files: FSFile[], userEmail: string}) => {
    const [showModal, setShowModal] = useState<boolean>(false);

    return (
        <div className='h-[90vh] w-[75] flex justify-center items-center pt-24'>
            <div className='flex flex-col items-center h-full w-full border-4 bg-white
            rounded-2xl border-primary p-4'>
                <div className='flex'>
                    <p className='text-2xl'>{`Title: ${message.title}`}</p>
                </div>
        
                <div className='flex flex-col'>
                    <p className='text-2xl'>Description:</p>
                    <p className='border-primary border-4 rounded-sm'>{message.description}</p>
                </div>

                <div className='flex'>
                    <p className='text-2xl'>{`Sent: ${new Date(message.dateSent).toLocaleDateString()}`}</p>
                </div>

                <div className='flex flex-col'>
                    <p className='text-2xl'>Files:</p>
                   {DisplayMessageFiles(files)}
                </div>

                {userEmail !== message.senderEmail ?
                <button 
                    className='p-2 px-5 m-7 mr-14 bg-green-500 hover:bg-green-600 active:bg-green-700
                    text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
                    text-lg'
                    onClick={() => setShowModal(true)}>
                    Reply To Message
                </button>
                : <></>}

                {showModal ? 
                    <MessageForm
                    title={"Replying to the Message"}
                    showModal={showModal}
                    callbackClose={() => setShowModal(false)}
                    callbackOpen={() => setShowModal(true)}
                    senderEmail={message.receiverEmail}
                    receiverEmail={message.senderEmail}
                    applicantEmails={[]}/>
                : <></>
                }
            </div>
        </div>
    )
};

const DisplayMessageFiles = (files: FSFile[]): JSX.Element => {
    return (
        <div className='flex flex-col'>
            {files.length > 0 ?
                files.map((file: FSFile) => {
                    return file && file.file ? 
                    <DownloadWrapper element={<span className="underline">{file.title}</span>} file={file.file} /> 
                    : "Error Loading File"
                })
            : <></>}
        </div>
    )
}


