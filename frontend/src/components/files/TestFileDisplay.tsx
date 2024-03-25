
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
  const [downloadLinks, setDownloadLinks] = useState<Blob[] | null>(null);
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

    const organization = user?.organization ? user?.organization : undefined;

    const res = await fetch(`http://localhost:${SERVER_PORT}/${user?.accountID}/${organization}/uploadFiles`, {
        method: 'POST',
        body: data
    });

    const resBody = await res.json();
    console.log(resBody);

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

    const organization = user?.organization ? user?.organization : undefined;

    const res = await fetch(`http://localhost:${SERVER_PORT}/${user?.accountID}/${organization}/uploadFiles`, {
        method: 'POST',
        body: data
    });

    console.log(res);
  }

  const downloadFile = async () => {
    const fileID = '6601bdeaf11d1a13f6907f85'

    const res = await fetch(`http://localhost:${SERVER_PORT}/files/${fileID}`, {
        method: 'GET',
    });

    const fileBlob = await res.blob();
    console.log(fileBlob)
    setDownloadLinks(prev => prev ? [...prev, fileBlob] : [fileBlob]);
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
            <button onClick={downloadFile}>Download A file</button>
        </div>
        {/* {downloadLinks ? downloadLinks?.map((blob : Blob) => {
        return (
            <a href={URL.createObjectURL(blob)} download={"image3.pdf"}>
                Download image 3 here!
            </a>
        )
    }): <></>} */}
    {
        imageFiles ? imageFiles.map((file: File) => {
            return (
                <a href={URL.createObjectURL(file)} download={file.name}>
                {file.name}
            </a>
            )
        }) : <></>
    }
    </div>
  )
}

export default TestFileDisplay
