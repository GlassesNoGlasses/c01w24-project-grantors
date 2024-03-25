import { SERVER_PORT } from "../constants/ServerConstants";
import { UploadFilesResponse } from "../interfaces/ServerResponse";

export default class FileController {

    // Returns the actual number of files uploaded successfully, or null.
    static async uploadFiles(fileTitle: string, files: File[]): Promise<number | undefined> {
        try {
            const data = new FormData();
            
            files.forEach((file: File) => {
                data.append(fileTitle, file);
            })

            const res = await fetch(`http://localhost:${SERVER_PORT}/uploadFiles`, {
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
    }
}