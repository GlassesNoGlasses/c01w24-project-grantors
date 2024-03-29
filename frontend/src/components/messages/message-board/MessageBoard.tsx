
import React, { useEffect, useState } from 'react'
import { MessageBoardProps } from './MessageBoardProps'
import { useUserContext } from '../../contexts/userContext'
import { useNavigate } from 'react-router-dom';
import { MessageForm } from '../message-form/MessageForm';
import ApplicationsController from '../../../controllers/ApplicationsController';
import { Application } from '../../../interfaces/Application';
import UserController from '../../../controllers/UserController';
import Table from '../../table/Table';
import { Column } from '../../table/TableProps';
import { Message } from '../../../interfaces/Message';
import MessageController from '../../../controllers/MessageController';

export const MessageBoard = ({

}: MessageBoardProps) => {

  const [applicantEmails, setApplicantEmails] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [messageCreated, setMessageCreated] = useState<boolean>(false);

  const {user} = useUserContext();
  const itemsPerPageOptions: number[] = [5,10,20];
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user?.email) {
      return;
    }

    // Fetch all applications of organization, then applicants to get their emails.
    ApplicationsController.fetchOrgApplications(user).then((applications: Application[] | undefined) => {
      if (applications) {
        const applicantIDs = applications.map((application: Application) => {return application.applicantID});
        UserController.fetchApplicants(applicantIDs).then((applicants) => {
          if (applicants) {
            const emails = applicants.map((applicant) => {return applicant.email});
            const uniqueEmails = emails.filter((email, index) => emails.indexOf(email) === index);
            setApplicantEmails(uniqueEmails);
          }
        })
      }
    })

    // Fetch all messages 
    MessageController.fetchMessages(user).then((messages: Message[] | undefined) => {
      if (messages) {
        setMessages(messages);
      }
    });

  }, []);

  useEffect(() => {

    if (messageCreated) {
      fetchMessages();
    }
  
  }, [messageCreated])

  // Fetch messages from backend
  const fetchMessages = (): void => {
    if (!user) {
      return;
    }
    // Fetch all messages 
    MessageController.fetchMessages(user).then((messages: Message[] | undefined) => {
      if (messages) {
        setMessages(messages);
      }
    });
  }

  const OnMessageRowClick = (data: Message): void => {
    MessageController.markMessageRead((data)).then((response: boolean) => {
      if (!response) {
        console.error("Error while marking message as read");
        return;
      }
    });
    navigate(`/messages/${data.id}`);
  }


  const columns: Column<Message>[] = [
    {
        title: "Message Title",
        format: (data: Message) => data.title,
        sort: (data1: Message, data2: Message) => data1.title < data2.title ? -1 : 1,
    },
    {
        title: "Sender",
        format: (data: Message) => data.senderEmail,
        sort: (data1: Message, data2: Message) => data1.senderEmail < data2.senderEmail ? -1 : 1,
    },
    {
        title: "Receiver",
        format: (data: Message) => data.receiverEmail,
        sort: (data1: Message, data2: Message) => data1.receiverEmail < data2.receiverEmail ? -1 : 1,
    },
    {
        title: "Submission Date",
        format: (data: Message) => {
          return new Date(data.dateSent).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        },
        sort: (data1: Message, data2: Message) => Number(new Date(data1.dateSent)) - Number(new Date(data2.dateSent)),
    },
    {
      title: "Message Status",
      format: (data: Message) => data.read ? "Read" : "Unread",
      sort: (data1: Message, data2: Message) => (data1.read === data2.read) ? 0 : data1.read ? 1 : -1,
    },
  ];

  return (
    <div className='h-full flex flex-col m-10 p-4 rounded-2xl bg-primary border-4 border-white shadow-2xl shadow-black'>
      {
        !user || !user?.email ? 
          <div className='flex font-bold text-xl justify-center mt-10'>Access Denied: Invalid Permission</div>
        :
        <div className='flex'>
          { user.isAdmin ?
          <button onClick={() => setShowModal(true)}
            className='bg-white px-4 py-2 rounded-lg font-bold hover:bg-blue-200 mb-5 border-[3px] border-black'>
            Create new Message!
          </button> : <></>}
          {
            showModal ?
            <MessageForm
            title={"Creating A New Message"}
            showModal={showModal}
            callbackClose={() => setShowModal(false)}
            callbackOpen={() => setShowModal(true)}
            setCreatedMessage={(created: boolean) => setMessageCreated(created)}
            senderEmail={user.email.toString()}
            applicantEmails={applicantEmails}/>
            : <></>
          }
        </div>
      }
       
      <div className='flex p-4'>
        <Table<Message>
            items={messages}
            columns={columns}
            itemsPerPageOptions={itemsPerPageOptions}
            defaultIPP={10}
            defaultSort={columns[3]}
            onRowClick={OnMessageRowClick}
        />
      </div>
    </div>
  )
}

