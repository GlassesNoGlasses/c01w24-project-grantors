
import React, { useState } from 'react'
import Dropzone, { DropzoneInputProps } from 'react-dropzone';
import axios from 'axios';
import { DropZoneFileProps } from './DropZoneFileProps';

const DropZoneFile = ({
  fileLimit,
  dropZoneElement,
  FileCallback,
  acceptedFileTypes
  }: DropZoneFileProps) => {

  // Hooks
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);

  // TODO: Remove after debugging
  React.useEffect(() => {
    console.log("EFFECT")
    console.log(droppedFiles);
    FileCallback(droppedFiles);
  }, [droppedFiles]);
  
  // Functions
  const OnDrop = (files: File[]): void => {
    console.log(files);
    UpdateDroppedFiles(files);
  };

  const UpdateDroppedFiles = (files: File[]): void => {
    const upperBound = Math.min(fileLimit.valueOf() <= 0 ? 1 : fileLimit.valueOf(), files.length);
    setDroppedFiles(files.slice(-1 * upperBound));
  };

  return (
  <div className='flex align-middle justify-center h-full w-full pt-24 z-10'>
    <Dropzone 
    onDrop={files => OnDrop(files)}
    accept={acceptedFileTypes}
    >
      {({getRootProps, getInputProps}) => (
        <section>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {dropZoneElement}
          </div>
        </section>
      )}
    </Dropzone>
</div>
  )
}

export default DropZoneFile
