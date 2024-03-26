import { SERVER_PORT } from "../constants/ServerConstants";
import { FSFile } from "../interfaces/FSFile";
import { GetFSFileResponse, GetFSFilesResponse, UploadFilesResponse } from "../interfaces/ServerResponse";
import { User } from "../interfaces/User";

export default class FileController {

    private static blobToFile(blob: Blob, fileName: string): File {
        const fileBlob: any = blob;

        fileBlob.lastModifiedDate = new Date();
        fileBlob.name = fileName;

        return fileBlob as File;
    }

    // Returns the actual number of files uploaded successfully, or undefined.
    static async uploadFiles(fileTitle: string, files: File[], user: User): Promise<number | undefined> {
        try {
            const data = new FormData();
            const userID = user.accountID;
            const organization = user.organization ? user.organization : "undefined";
            
            files.forEach((file: File) => {
                data.append(fileTitle, file);
            });

            const res = await fetch(`http://localhost:${SERVER_PORT}/${userID}/${organization}/uploadFiles`, {
                method: 'POST',
                body: data,
            });

            // Bad request, return undefined.
            if (!res.ok) {
                return undefined;
            }

            return await res.json().then((resData: UploadFilesResponse) => {
                return resData.insertedCount;
            })

        } catch (error) {
            console.error("Error while uploading files", error);
            return undefined;
        }
    };

     // Returns type File of the file with the corresponding fileID, or undefined.
     static async fetchFile(fileID: string, fileName: string): Promise<File | undefined> {
        if (!fileID || !fileName) {
            console.log("here");
            return undefined;
        };

        try {
            const res = await fetch(`http://localhost:${SERVER_PORT}/files/downloadable/${fileID}`, {
                method: 'GET',
            });

            // Bad request, return undefined.
            if (!res.ok) {
                console.log("here1");
                return undefined;
            }
            
            const fileBlob: Blob = await res.blob();
            const file = FileController.blobToFile(fileBlob, fileName);

            return file;
        } catch (error) {
            console.log("here2");
            console.error("Error while uploading files", error);
            return undefined;
        }
    };

     // Returns the FSFile with the corresponding fileID, or undefined.
     static async fetchFSFile(fileID: string, fileName: string): Promise<FSFile | undefined> {
        if (!fileID) {
            return undefined;
        };

        try {
            const res = await fetch(`http://localhost:${SERVER_PORT}/files/${fileID}`, {
                method: 'GET',
            });

            // Bad request, return undefined.
            if (!res.ok) {
                return undefined;
            }

            const file = await FileController.fetchFile(fileID, fileID);

            return await res.json().then((data : GetFSFileResponse) => {
                return data.response ? {...data.response, file: file} : undefined;
            });

        } catch (error) {
            console.error("Error while uploading files", error);
            return undefined;
        }
    };

     // Returns the FSFile of the corresponding organization, or undefined.
     static async fetchOrgFSFiles(organization: string): Promise<FSFile[] | undefined> {
        if (!organization) {
            return undefined;
        };

        try {
            const res = await fetch(`http://localhost:${SERVER_PORT}/files/organization/${organization}`, {
                method: 'GET',
            });

            // Bad request, return undefined.
            if (!res.ok) {
                return undefined;
            }

            const fsFiles = await res.json().then((data : GetFSFilesResponse) => {
                return data.response;
            });

            if (!fsFiles) {
                return undefined;
            }

            const filteredFSFiles = await Promise.all(fsFiles.map(async (fs: FSFile) => {
                const file = await FileController.fetchFile(fs.id, fs.title).then((file : File | undefined) => {
                    return file;
                });

                return {...fs, file: file};
            }))

            return filteredFSFiles;

        } catch (error) {
            console.error("Error while uploading files", error);
            return undefined;
        }
    };

     // Returns the FSFile of the corresponding user, or undefined.
     static async fetchUserFSFiles(user: User): Promise<FSFile[] | undefined> {
        if (!user) {
            return undefined;
        };

        try {
            const res = await fetch(`http://localhost:${SERVER_PORT}/files/user/${user.accountID}`, {
                method: 'GET',
            });

            // Bad request, return undefined.
            if (!res.ok) {
                return undefined;
            }

            const fsFiles = await res.json().then((data : GetFSFilesResponse) => {
                return data.response;
            });

            if (!fsFiles) {
                return undefined;
            }

            const filteredFSFiles = await Promise.all(fsFiles.map(async (fs: FSFile) => {
                const file = await FileController.fetchFile(fs.id, fs.title).then((file : File | undefined) => {
                    return file;
                });

                return {...fs, file: file};
            }))

            return filteredFSFiles;

        } catch (error) {
            console.error("Error while uploading files", error);
            return undefined;
        }
    };
}