
import React, { useState } from 'react'
import DropZoneFile from './dropzone/DropZoneFile'
import { SERVER_PORT } from '../../constants/ServerConstants';
import { Accept } from '../../interfaces/Accept';
import { useUserContext } from '../contexts/userContext';
import FileController from '../../controllers/FileController';
import { FSFile } from '../../interfaces/FSFile';

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
  const [downloadLinks, setDownloadLinks] = useState<FSFile[] | null>(null);
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

    if (!user) {
        return;
    }

    FileController.uploadFiles("test2", imageFiles, user)
    .then((numInserted: number | undefined) => {
        console.log(numInserted);
    });
  }

  const handleTextSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("SUBMITTING!")

    if (textFiles.length === 0) {
        return;
    }

    if (!user) {
        return;
    }

    FileController.uploadFiles("test3", textFiles, user)
    .then((numInserted: number | undefined) => {
        console.log(numInserted);
    });
  }

  const getOrganizationFiles = async () => {
    if (!user || !user.organization) {
        return;
    }

    FileController.fetchOrgFSFiles(user.organization)
    .then((fsFiles: FSFile[] | undefined) => {
        if (fsFiles) {
            setDownloadLinks(fsFiles);
        }
    });
  };

  const getUserFSFiles = async () => {
    if (!user) {
        return;
    }

    FileController.fetchUserFSFiles(user)
    .then((fsFiles: FSFile[] | undefined) => {
        if (fsFiles) {
            setDownloadLinks(fsFiles);
        }
    });
  }

  const fetchFile = async () => {
    const fileID = '660215c078f6d533802bd26e'
    const filename = 'image3 (1).png'

    FileController.fetchFile(fileID, filename)
    .then((file: File| undefined) => {
        // console.log(file);
    });
  }

  return (
    <div className='min-h-fill min-w-full'>
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
        <div className='flex h-2/4 min-w-full'>
            <button onClick={fetchFile}>Fetch a FILE from db</button>
        </div>
        <div className='flex h-2/4 min-w-full'>
            <button onClick={getUserFSFiles}>Get User Files</button>
        </div>
        <div className='flex h-2/4 min-w-full'>
            <button onClick={getOrganizationFiles}>Get Org Files</button>
        </div>
        {downloadLinks ? downloadLinks?.map((fs : FSFile) => {
            if (fs.file) {
                return (
                    <a href={URL.createObjectURL(fs.file)} download={`${fs.title}`}>
                        {`Download ${fs.title} here!`}
                    </a>
                )
            }
    }): <></>}
    </div>
  )
}

export default TestFileDisplay
