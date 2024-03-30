
import React, { useState } from 'react'
import Dropzone from 'react-dropzone';
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
    FileCallback(droppedFiles);
  }, [droppedFiles]);
  
  // Functions
  const OnDrop = (files: File[]): void => {
    UpdateDroppedFiles(files);
  };

  const UpdateDroppedFiles = (files: File[]): void => {
    const upperBound = Math.min(fileLimit.valueOf() <= 0 ? 1 : fileLimit.valueOf(), files.length);
    setDroppedFiles(files.slice(-1 * upperBound));
  };

  return (
  <div className='z-10'>
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
