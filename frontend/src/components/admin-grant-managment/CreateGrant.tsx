import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts/userContext';
import { Grant, GrantQuestion } from '../interfaces/Grant' 
import GrantForm from './GrantForm';


let ID = 0
const SERVER_PORT = 8000


const CreateGrant = () => {
  return (
    <GrantForm port={SERVER_PORT} type='create'/>
  )
}

export default CreateGrant