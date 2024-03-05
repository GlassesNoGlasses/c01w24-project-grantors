import {admins, users} from './data.js'

const SERVER_URL = "http://localhost:8000";

const SignUpAdmins = () => {
    try {
        admins.forEach(async (admin) => {
            console.log(admin);
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

const SignUpUsers = () => {
    try {
        users.forEach(async (user) => {
            console.log(user);
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

export const SetUpDB = () => {
    try {
        SignUpAdmins();
        SignUpUsers();
    } catch (error) {
        console.error("Error with populating DB: ", error);
    }
};

SetUpDB();

