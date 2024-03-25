
import React, { useState } from 'react'
import DropZoneFile from './dropzone/DropZoneFile'
import { SERVER_PORT } from '../../constants/ServerConstants';
import { Accept } from '../../interfaces/Accept';
import { useUserContext } from '../contexts/userContext';

const TestFileDisplay = () => {

  const acceptedFileTypesImages: Accept = {
    'image/*': ['.png', '.jpeg', '.jpg'],
  };

  const acceptedFileTypesTexts: Accept = {
    'application/pdf' : ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'text/plain': ['.txt']
  }
  
  // States
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [textFiles, setTextFiles] = useState<File[]>([]);
  const {user} = useUserContext();

  // Helper Functions
  const FileDisplay = (): JSX.Element => {
    return (
        <button className='p-2 px-5 m-2 bg-secondary hover:bg-primary
        text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
        text-base'>
            Drag n' drop files here, or click to select files!
        </button>
    )
  };

  const handleImageSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("SUBMITTING!")

    if (imageFiles.length === 0) {
        return;
    }

    const data = new FormData();
    imageFiles.forEach((file: File) => {
        data.append('test1', file);
    })

    console.log(user?.accountID);

    const res = await fetch(`http://localhost:${SERVER_PORT}/${user?.isAdmin}/${user?.accountID}/uploadFiles`, {
        method: 'POST',
        body: data,
    });

    console.log(res);
  }

  const handleTextSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("SUBMITTING!")

    if (textFiles.length === 0) {
        return;
    }

    const data = new FormData();
    textFiles.forEach((file: File) => {
        data.append('test1', file);
    })

    const res = await fetch(`http://localhost:${SERVER_PORT}/uploadFiles`, {
        method: 'POST',
        body: data,
    });

    console.log(res);
  }

  React.useEffect(() => {
    console.log("NEW PARENT FILES: ", imageFiles);
  }, [imageFiles])

  return (
    <div>
        <form onSubmit={handleImageSubmit}
        encType="multipart/form-data">
            <DropZoneFile
            fileLimit={2}
            FileCallback={(droppedFiles) => setImageFiles(droppedFiles)}
            dropZoneElement={FileDisplay()}
            acceptedFileTypes={acceptedFileTypesImages}
            />
            {imageFiles.map((file, index) => (
                <li key={index} className='list-none'>
                    <div className="flex flex-col gap-1 p-5 px-3">
                        <label className='text-base'>{file.name}</label>
                    </div>
                </li>
            ))}
            <button 
                className='p-2 px-5 m-7 mr-14 bg-green-500 hover:bg-green-600 active:bg-green-700
                text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
                text-lg' 
                type="submit" 
                name="submit">
                Submit Form
            </button>
        </form>
        <form onSubmit={handleTextSubmit}
        encType="multipart/form-data">
            <DropZoneFile
            fileLimit={2}
            FileCallback={(droppedFiles) => setTextFiles(droppedFiles)}
            dropZoneElement={FileDisplay()}
            acceptedFileTypes={acceptedFileTypesTexts}
            />
            {textFiles.map((file, index) => (
                <li key={index} className='list-none'>
                    <div className="flex flex-col gap-1 p-5 px-3">
                        <label className='text-base'>{file.name}</label>
                    </div>
                </li>
            ))}
            <button 
                className='p-2 px-5 m-7 mr-14 bg-green-500 hover:bg-green-600 active:bg-green-700
                text-white font-bold rounded-lg shadow-md transition-colors duration-150 ease-in
                text-lg' 
                type="submit" 
                name="submit">
                Submit Form
            </button>
        </form>
    </div>
  )
}

export default TestFileDisplay
