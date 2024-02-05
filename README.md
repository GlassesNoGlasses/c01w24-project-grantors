# CSCC01-Project
The project repository CSC C01.

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