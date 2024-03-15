import {admins, users, applications, grants} from './data.js'

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

const PopulateGrants = () => {
    try {
        grants.forEach(async (grant) => {
            const resp = await fetch(`${SERVER_URL}/createGrant`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: grant.title,
                    description: grant.description,
                    deadline: grant.deadline,
                    minAmount: grant.minAmount,
                    maxAmount: grant.maxAmount,
                    organization: grant.organization,
                    category: grant.category,
                    contact: grant.contact,
                    questions: grant.questions,
                    publish: grant.publish,
                    owner: grant.accId
                }),
            });
            console.log(await resp.json());
        });
    } catch (error) {
        console.error("Could not populate Grants to DB.");
    };
};

const PopulateApplications = () => {
    try {
        applications.forEach(async (app) => {
            const resp = await fetch(`${SERVER_URL}/submitApplication`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userID: app.userID,
                    grantID: app.grantID,
                    grantTitle: app.grantTitle,
                    grantCategory: app.grantCategory, 
                    submitted: app.submitted,
                    submissionDate: app.submissionDate,
                    status: app.status,
                    awarded: app.awarded, 
                    responses: app.awarded,
                }),
            });
            console.log(await resp.json());
        });
    } catch (error) {
        console.error("Could not populate Applications to DB.");
    };
};

export const SetUpDB = () => {
    try {
        SignUpAdmins();
        SignUpUsers();
        PopulateGrants();
        PopulateApplications();
    } catch (error) {
        console.error("Error with populating DB: ", error);
    }
};

SetUpDB();

