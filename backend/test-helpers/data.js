
export const admins = 
[
    {
        "isAdmin": true,
        "username": "alex",
        "firstName": "alex",
        "lastName": "zeng",
        "email": "alex@mail",
        "password": "123"
    }
];

export const users = 
[
    {
        "isAdmin": false,
        "username": "rawad",
        "firstName": "rawad",
        "lastName": "assi",
        "email": "rawad@abou",
        "password": "123",
    },

    {
        "username": "neil",
        "email": "neil@mail.com",
        "password": "123",
        "firstName": "Neil",
        "lastName": "Wang",
        "isAdmin": false
    }
];

export const applications = 
[
    {
        id: 1,
        userID: 2,
        grantID: 1,
        grantTitle: "Community Accessibility Grant",
        grantCategory: "Community Development", 
        submitted: true,
        submissionDate: new Date(),
        status: "Submitted",
        awarded: 0,
        responses: [],
    },
    {
        id: 2,
        userID: 2,
        grantID: 2,
        grantTitle: "Educational Accessibility Initiative",
        grantCategory: "Education", 
        submitted: true,
        submissionDate: new Date(),
        status: "Submitted",
        awarded: 0, 
        responses: [],
    },
    {
        id: 3,
        userID: 1,
        grantID: 3,
        grantTitle: "Accessible Technology Research Grant",
        grantCategory: "Technology", 
        submitted: true,
        submissionDate: new Date(),
        status: "Submitted",
        awarded: 0, 
        responses: [],
    },
    {
        id: 4,
        userID: 1,
        grantID: 2,
        grantTitle: "Educational Accessibility Initiative",
        grantCategory: "Education", 
        submitted: true,
        submissionDate: new Date(),
        status: "In Progress",
        awarded: 0, 
        responses: [],
    },
    {
        id: 5,
        userID: 3,
        grantID: 4,
        grantTitle: "Employment Accessibility Grant",
        grantCategory: "Employment", 
        submitted: true,
        submissionDate: new Date(),
        status: "Submitted",
        awarded: 0, 
        responses: [],
    },
    {
        id: 6,
        userID: 3,
        grantID: 5,
        grantTitle: "Accessible Healthcare Services Grant",
        grantCategory: "Healthcare", 
        submitted: true,
        submissionDate: new Date(),
        status: "In Progress",
        awarded: 0, 
        responses: [],
    },
]