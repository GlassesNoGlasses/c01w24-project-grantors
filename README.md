# CSCC01-Project
The project repository CSC C01.

## How to run with Docker
To build and run the program in a Docker container, do `docker-compose up`. 

If you want to rebuild images (i.e after changes to the code), do `docker-compose up --build` instead.

If you have previously started up a mongodb server on port 127017, and want to connect to the database in the container, change the mongodb port in `docker-compose` from `27017:27017` to `27018:27017`, and connect via compass on the address `mongodb://localhost:27018`. Alternatively, you can delete the remote database first, . Otherwise compass will connect to the database you opened locally.

## How to run frontend
Initialize
```bash
cd frontend
npm install
```
Run dev server
```bash
npm start
```

## How to run backend
Initialize
```bash
cd backend
npm install
```

Get mongo running
```bash
# Create data/db folders
mkdir data
cd data
mkdir db
cd ..
# Run monogodb, this will depend on your OS
mongod --path=./data/db
```

Run dev server
```bash
npm run dev
```

## File System 101

Example found in `TestFileDisplay.tsx`.


How are Files stored (Local):

```
The actual files themselves (.png, .jpeg, etc.,) are
stored locally in the directory `/backend/uploads/`.

For admins, the format is: `uploads/admin/[organization]`.
For users, the format is: `uploads/client/[accountID]`.
```

How are Files stored (MongoDB):

```
MongoDB stores files of interface `FSFiles`,
found in `/interfaces/FSFile.ts`.

`FSFiles` was created in order to add more information
that may be required of a file, such as IDs, etc..
```

How to upload files:
```
There are 2 main ways to upload a file:

1. Use the component `DropZoneFile.tsx`,
that allows basically acts as a wrapper for
whatever element you want to display to upload files.

You can drag and drop, specify what type of files
(i.e. .jpg, .pdf, etc.), and limit the number of files you
want to submit as well with the parameters.

2. Use <input type="file">.

In either case, ENSURE that the form element you use
for uploading files has field: `encType="multipart/form-data"`


Use FileController.uploadFiles(batchName: str,
                                files: File[], user)
to upload files. Follow example in  `TestFileDisplay.tsx`.
```

Fetching Files:

```
There are multiple ways to fetch files.

Fetch a single FSFile: FileController.fetchFSFile

Fetch FSFiles by organizations: FileController.fetchOrgFSFiles

Fetch FSFiles by userID: FileController.fetchUserFSFiles

Fetch a FILE by fileID: FileController.fetchFile
```

Downloading Files:

```
Files are downloaded using an anchor tag, creating
a temporary browswer URL to file based on the file's path,
and routing the user there.

You can either: 
Use an anchor tag like examples in `TestFileDisplay.tsx`.

Use the `DownloadWrapper.tsx` component, which takes in
a file File and an HTML/React element and does the
necessary wrapping of the download feature for you. This
allows for dynamic displays on a downloadable file.
```

## Notes
- `Node` and `npm` versions:
    - `node v21.6.1`
    - `npm v10.2.4`
- `npm install` has to be ran every time to we add new dependencies or change our dependencies in any way
- Recommended VSCode Extensions
    - [Postman](https://marketplace.visualstudio.com/items?itemName=Postman.postman-for-vscode)
    - [Tailwind](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
    - [Typescript](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)
    - [HTML CSS Support](https://marketplace.visualstudio.com/items?itemName=ecmel.vscode-html-css)

## Resources
- [React docs](https://react.dev/reference/react)
- [Tailwind docs](https://tailwindcss.com/docs/installation)
- [Typescript docs](https://www.typescriptlang.org/docs/)
- [Express docs](https://expressjs.com/en/4x/api.html)
- [MongoDB docs](https://www.mongodb.com/docs/drivers/node/current/)
