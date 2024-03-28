
import React, { useEffect, useState } from 'react'
import { MessageBoardProps } from './MessageBoardProps'
import { useUserContext } from '../../contexts/userContext'
import { useNavigate } from 'react-router-dom';
import { MessageForm } from '../message-form/MessageForm';
import ApplicationsController from '../../../controllers/ApplicationsController';
import { Application } from '../../../interfaces/Application';
import UserController from '../../../controllers/UserController';

export const MessageBoard = ({

}: MessageBoardProps) => {

  /* TODO:

  Get list of applicant emails:
  1. Fetch all organization applications with applicationController.
  2. Fetch all appliciant emails from the applications.
  */

  const [applicantEmails, setApplicantEmails] = useState<string[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  const {user} = useUserContext();
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
  }, []);

  return (
    <div className='h-full flex flex-col py-20'>
      {
        !user || !user?.email ? 
          <div className='flex font-bold text-xl justify-center mt-10'>Access Denied: Invalid Permission</div>
        :
        <div className='flex'>
          <button onClick={() => setShowModal(true)}>
            Create new Message!
          </button>
          {
            showModal ?
            <MessageForm
            showModal={showModal}
            callbackClose={() => setShowModal(false)}
            callbackOpen={() => setShowModal(true)}
            senderEmail={user.email}
            applicantEmails={applicantEmails}/>
            : <></>
          }
        </div>
      }
    </div>
  )
}

