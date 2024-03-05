const SERVER_URL = "http://localhost:8000";

const myAdmins = [
    {
        "isAdmin": true,
        "username": "alex",
        "firstName": "alex",
        "lastName": "zeng",
        "email": "alex@mail",
        "password": "123"
    }
];

const myUsers = [
    {
        "isAdmin": false,
        "username": "rawad",
        "firstName": "rawad",
        "lastName": "assi",
        "email": "rawad@abou",
        "password": "123"
    }
];

const SignUpAdmins = async () => {
    try {
        myAdmins.forEach(async (admin) => {
            await fetch(`${SERVER_URL}/signup`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  username: admin.username,
                  email: admin.email,
                  password: admin.password,
                  firstName: admin.firstName,
                  lastName: admin.lastName,
                  isAdmin: admin.isAdmin
                }),
            });
        });
    } catch (error) {
        console.error("Could not populate Admins to DB.");
    };
};

const SignUpUsers = async () => {
    try {
        myUsers.forEach(async (user) => {
            const resp = await fetch(`${SERVER_URL}/signup`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  username: user.username,
                  email: user.email,
                  password: user.password,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  isAdmin: user.isAdmin
                }),
            });
        });
    } catch (error) {
        console.error("Could not populate Users to DB.");
    };
};

const Start = async () => {
    await SignUpAdmins();
    await SignUpUsers();
};

Start();
