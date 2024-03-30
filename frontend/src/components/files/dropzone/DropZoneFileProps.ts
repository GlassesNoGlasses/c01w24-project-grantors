import { Accept } from "react-dropzone";

export interface DropZoneFileProps {
    fileLimit: Number, // limit number of files to be submitted.
    dropZoneElement: React.ReactNode | JSX.Element, // Dropzone element
    FileCallback: (files : File[]) => void, // callback function

    // The accepted file types; key is a MIME type, value is array of file type.
    // FYI: https://react-dropzone.js.org/#section-accepting-specific-file-types
    acceptedFileTypes: Accept
}
