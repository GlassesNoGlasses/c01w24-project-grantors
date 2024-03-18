
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

export const grants = 
[
    {
        id: 1,
        title: "Community Accessibility Grant",
        description: "This grant aims to fund projects that improve accessibility for people with disabilities within local communities.",
        posted: new Date("2024-02-15"),
        deadline: new Date("2024-03-31"),
        minAmount: 5000,
        maxAmount: 10000,
        organization: "Local Community Foundation",
        category: "Community Development",
        contact: "John Doe, johndoe@example.com",
        questions: [
            { id: 1, question: "What is your project plan?", answer: null },
            { id: 2, question: "How will your project benefit the community?", answer: null }
        ],
        publish: true,
    },
    {
        id: 2,
        title: "Educational Accessibility Initiative",
        description: "Funding available for educational institutions seeking to implement accessibility enhancements for students with disabilities.",
        posted: new Date("2024-02-20"),
        deadline: new Date("2024-04-15"),
        minAmount: 10000,
        maxAmount: 20000,
        organization: "Education Enhancement Fund",
        category: "Education",
        contact: "Jane Smith, janesmith@example.com",
        questions: [
            { id: 1, question: "How will your institution ensure accessibility for all students?", answer: null },
            { id: 2, question: "What specific enhancements are you planning to implement?", answer: null }
        ],
        publish: true,
    },
    {
        id: 3,
        title: "Accessible Technology Research Grant",
        description: "This grant supports research projects focused on developing innovative accessible technologies for people with disabilities.",
        posted: new Date("2024-02-25"),
        deadline: new Date("2024-05-30"),
        minAmount: 15000,
        maxAmount: 30000,
        organization: "Tech Innovations Foundation",
        category: "Technology",
        contact: "Alex Johnson, alexjohnson@example.com",
        questions: [
            { id: 1, question: "What is the objective of your research project?", answer: null },
            { id: 2, question: "How will your research contribute to improving accessibility?", answer: null }
        ],
        publish: true,
    },
    {
        id: 4,
        title: "Employment Accessibility Grant",
        description: "Funding available for businesses implementing accessibility measures to improve employment opportunities for people with disabilities.",
        posted: new Date("2024-03-01"),
        deadline: new Date("2024-06-15"),
        minAmount: 7500,
        maxAmount: 15000,
        organization: "Employment Equality Agency",
        category: "Employment",
        contact: "Michael Brown, michaelbrown@example.com",
        questions: [
            { id: 1, question: "How will your business ensure accessibility in the workplace?", answer: null },
            { id: 2, question: "What specific measures are you planning to implement?", answer: null }
        ],
        publish: true,
    },
    {
        id: 5,
        title: "Accessible Healthcare Services Grant",
        description: "This grant aims to support healthcare facilities in making their services more accessible to patients with disabilities.",
        posted: new Date("2024-03-05"),
        deadline: new Date("2024-07-31"),
        minAmount: 12000,
        maxAmount: 25000,
        organization: "Healthcare Access Foundation",
        category: "Healthcare",
        contact: "Emily Davis, emilydavis@example.com",
        questions: [
            { id: 1, question: "How will your healthcare facility improve accessibility for patients?", answer: null },
            { id: 2, question: "What specific improvements are you planning to make?", answer: null }
        ],
        publish: true,
    },
    {
        id: 6,
        title: "Transportation Accessibility Grant",
        description: "Funding available for projects aimed at improving transportation accessibility for people with disabilities.",
        posted: new Date("2024-03-10"),
        deadline: new Date("2024-08-31"),
        minAmount: 8000,
        maxAmount: 15000,
        organization: "Transportation Access Initiative",
        category: "Transportation",
        contact: "David Wilson, davidwilson@example.com",
        questions: [
            { id: 1, question: "What transportation improvements will your project focus on?", answer: null },
            { id: 2, question: "How will your project benefit people with disabilities?", answer: null }
        ],
        publish: true,
    },
    {
        id: 7,
        title: "Accessible Housing Grant",
        description: "This grant aims to fund projects that enhance the accessibility of housing options for people with disabilities.",
        posted: new Date("2024-03-15"),
        deadline: new Date("2024-09-30"),
        minAmount: 10000,
        maxAmount: 20000,
        organization: "Housing Accessibility Fund",
        category: "Housing",
        contact: "Sarah Johnson, sarahjohnson@example.com",
        questions: [
            { id: 1, question: "What types of housing improvements will your project focus on?", answer: null },
            { id: 2, question: "How will your project ensure accessibility for people with disabilities?", answer: null }
        ],
        publish: true,
    },
    {
        id: 8,
        title: "Accessible Recreational Facilities Grant",
        description: "Funding available for projects aimed at improving accessibility in recreational facilities for people with disabilities.",
        posted: new Date("2024-03-20"),
        deadline: new Date("2024-10-31"),
        minAmount: 6000,
        maxAmount: 12000,
        organization: "Recreation Access Foundation",
        category: "Recreation",
        contact: "Mark Thompson, markthompson@example.com",
        questions: [
            { id: 1, question: "What recreational facilities will your project focus on?", answer: null },
            { id: 2, question: "How will your project enhance accessibility in these facilities?", answer: null }
        ],
        publish: true,
    },
    {
        id: 9,
        title: "Accessible Arts and Culture Grant",
        description: "This grant supports projects that promote accessibility in arts and cultural activities for people with disabilities.",
        posted: new Date("2024-03-25"),
        deadline: new Date("2024-11-30"),
        minAmount: 7000,
        maxAmount: 15000,
        organization: "Arts Access Foundation",
        category: "Arts and Culture",
        contact: "Laura Davis, lauradavis@example.com",
        questions: [
            { id: 1, question: "What arts and cultural activities will your project focus on?", answer: null },
            { id: 2, question: "How will your project make these activities more accessible?", answer: null }
        ],
        publish: true,
    },
    {
        id: 10,
        title: "Accessible Sports and Recreation Grant",
        description: "Funding available for projects aimed at improving accessibility in sports and recreational activities for people with disabilities.",
        posted: new Date("2024-04-01"),
        deadline: new Date("2024-12-31"),
        minAmount: 8000,
        maxAmount: 18000,
        organization: "Sports Access Foundation",
        category: "Sports",
        contact: "Chris Roberts, chrisroberts@example.com",
        questions: [
            { id: 1, question: "What sports and recreational activities will your project focus on?", answer: null },
            { id: 2, question: "How will your project enhance accessibility in these activities?", answer: null }
        ],
        publish: true,
    },
    {
        id: 11,
        title: "Accessible Technology Education Grant",
        description: "This grant supports educational initiatives aimed at teaching accessibility principles and technologies to students with disabilities.",
        posted: new Date("2024-04-05"),
        deadline: new Date("2025-01-31"),
        minAmount: 9000,
        maxAmount: 20000,
        organization: "Technology Education Fund",
        category: "Education",
        contact: "Daniel Brown, danielbrown@example.com",
        questions: [
            { id: 1, question: "What educational initiatives will your project offer?", answer: null },
            { id: 2, question: "How will your project benefit students with disabilities?", answer: null }
        ],
        publish: true,
    },
    {
        id: 12,
        title: "Accessible Public Spaces Grant",
        description: "Funding available for projects aimed at improving accessibility in public spaces for people with disabilities.",
        posted: new Date("2024-04-10"),
        deadline: new Date("2025-02-28"),
        minAmount: 10000,
        maxAmount: 22000,
        organization: "Public Space Accessibility Initiative",
        category: "Community Development",
        contact: "Emma Wilson, emmawilson@example.com",
        questions: [
            { id: 1, question: "What public spaces will your project focus on?", answer: null },
            { id: 2, question: "How will your project enhance accessibility in these spaces?", answer: null }
        ],
        publish: true,
    },
    {
        id: 13,
        title: "Accessible Communication Technologies Grant",
        description: "This grant supports projects aimed at developing and implementing accessible communication technologies for people with disabilities.",
        posted: new Date("2024-04-15"),
        deadline: new Date("2025-03-31"),
        minAmount: 12000,
        maxAmount: 25000,
        organization: "Communication Access Foundation",
        category: "Technology",
        contact: "Sophia Lee, sophialee@example.com",
        questions: [
            { id: 1, question: "What communication technologies will your project focus on?", answer: null },
            { id: 2, question: "How will your project ensure accessibility in these technologies?", answer: null }
        ],
        publish: true,
    },
    {
        id: 14,
        title: "Accessible Tourism Grant",
        description: "Funding available for projects aimed at improving accessibility in the tourism industry for people with disabilities.",
        posted: new Date("2024-04-20"),
        deadline: new Date("2025-04-30"),
        minAmount: 8000,
        maxAmount: 15000,
        organization: "Tourism Accessibility Initiative",
        category: "Tourism",
        contact: "Olivia White, oliviawhite@example.com",
        questions: [
            { id: 1, question: "What aspects of tourism will your project focus on?", answer: null },
            { id: 2, question: "How will your project enhance accessibility in these aspects?", answer: null }
        ],
        publish: true,
    },
    {
        id: 15,
        title: "Accessible Environmental Conservation Grant",
        description: "This grant supports projects that promote accessibility in environmental conservation efforts for people with disabilities.",
        posted: new Date("2024-04-25"),
        deadline: new Date("2025-05-31"),
        minAmount: 10000,
        maxAmount: 20000,
        organization: "Environmental Access Foundation",
        category: "Environment",
        contact: "Noah Brown, noahbrown@example.com",
        questions: [
            { id: 1, question: "What environmental conservation efforts will your project focus on?", answer: null },
            { id: 2, question: "How will your project make these efforts more accessible?", answer: null }
        ],
        publish: true,
    },
    {
        id: 16,
        title: "Accessible Legal Services Grant",
        description: "Funding available for projects aimed at improving accessibility in legal services for people with disabilities.",
        posted: new Date("2024-05-01"),
        deadline: new Date("2025-06-30"),
        minAmount: 8000,
        maxAmount: 15000,
        organization: "Legal Access Foundation",
        category: "Legal Services",
        contact: "Nathan Adams, nathanadams@example.com",
        questions: [
            { id: 1, question: "What legal services will your project focus on?", answer: null },
            { id: 2, question: "How will your project enhance accessibility in these services?", answer: null }
        ],
        publish: true,
    },
    {
        id: 17,
        title: "Accessible Social Services Grant",
        description: "This grant aims to fund projects that improve accessibility in social services for people with disabilities.",
        posted: new Date("2024-05-05"),
        deadline: new Date("2025-07-31"),
        minAmount: 12000,
        maxAmount: 25000,
        organization: "Social Services Access Fund",
        category: "Social Services",
        contact: "Ethan Wilson, ethanwilson@example.com",
        questions: [
            { id: 1, question: "What social services will your project focus on?", answer: null },
            { id: 2, question: "How will your project ensure accessibility in these services?", answer: null }
        ],
        publish: true,
    },
    {
        id: 18,
        title: "Accessible Emergency Response Grant",
        description: "Funding available for projects aimed at improving accessibility in emergency response services for people with disabilities.",
        posted: new Date("2024-05-10"),
        deadline: new Date("2025-08-31"),
        minAmount: 10000,
        maxAmount: 20000,
        organization: "Emergency Response Accessibility Initiative",
        category: "Emergency Services",
        contact: "Liam Smith, liamsmith@example.com",
        questions: [
            { id: 1, question: "What emergency response services will your project focus on?", answer: null },
            { id: 2, question: "How will your project enhance accessibility in these services?", answer: null }
        ],
        publish: true,
    },
    {
        id: 19,
        title: "Accessible Financial Services Grant",
        description: "This grant supports projects aimed at improving accessibility in financial services for people with disabilities.",
        posted: new Date("2024-05-15"),
        deadline: new Date("2025-09-30"),
        minAmount: 8000,
        maxAmount: 15000,
        organization: "Financial Access Foundation",
        category: "Financial Services",
        contact: "Grace Miller, gracemiller@example.com",
        questions: [
            { id: 1, question: "What financial services will your project focus on?", answer: null },
            { id: 2, question: "How will your project enhance accessibility in these services?", answer: null }
        ],
        publish: true,
    },
    {
        id: 20,
        title: "Accessible Employment Training Grant",
        description: "Funding available for projects aimed at providing employment training opportunities for people with disabilities.",
        posted: new Date("2024-05-20"),
        deadline: new Date("2025-10-31"),
        minAmount: 10000,
        maxAmount: 20000,
        organization: "Employment Training Access Initiative",
        category: "Employment",
        contact: "Sophie Brown, sophiebrown@example.com",
        questions: [
            { id: 1, question: "What employment training programs will your project offer?", answer: null },
            { id: 2, question: "How will your project benefit participants with disabilities?", answer: null }
        ],
        publish: true,
    },
    {
        id: '65f6326d04249a6f006a9429',
        title: "UTAPS",
        description: "Grant to suppliment federal and provincial student aid.",
        posted: new Date("2024-09-20"),
        deadline: new Date("2025-02-28"),
        minAmount: 100,
        maxAmount: 7000,
        organization: "University of Toronto",
        category: "Education",
        contact: "Gibbly Bibbly, gibblybibbly@utoronto.com",
        questions: [
            { id: 1, question: "How much in funding have you received from federal or provincial sources?", answer: null },
            { id: 2, question: "Parents net income for 2023", answer: null }
        ],
        publish: true,
    },
    {
        id: '65f6326d04249a6f006a9429',
        title: "UTAPS",
        description: "Grant to suppliment federal and provincial student aid.",
        posted: new Date("2025-09-20"),
        deadline: new Date("2026-02-28"),
        minAmount: 100,
        maxAmount: 7000,
        organization: "University of Toronto",
        category: "Education",
        contact: "Gibbly Bibbly, gibblybibbly@utoronto.com",
        questions: [
            { id: 1, question: "How much in funding have you received from federal or provincial sources?", answer: null },
            { id: 2, question: "Parents net income for 2023", answer: null }
        ],
        publish: false,
    }
];

export const applications = 
[
    {
        id: 1,
        userID: 3,
        grantID: '65f6326d04249a6f006a9429',
        grantTitle: "UTAPS",
        grantCategory: "Education", 
        submitted: true,
        submissionDate: new Date(),
        status: "Submitted",
        awarded: 0, 
        responses: [],
    },
    {
        id: 2,
        userID: 4,
        grantID: '65f6326d04249a6f006a9429',
        grantTitle: "UTAPS",
        grantCategory: "Education", 
        submitted: true,
        submissionDate: new Date(),
        status: "Submitted",
        awarded: 0, 
        responses: [],
    },
    {
        id: 3,
        userID: 5,
        grantID: '65f6326d04249a6f006a9429',
        grantTitle: "UTAPS",
        grantCategory: "Education", 
        submitted: true,
        submissionDate: new Date(),
        status: "Submitted",
        awarded: 0, 
        responses: [],
    },
    {
        id: 4,
        userID: 6,
        grantID: '65f6326d04249a6f006a9429',
        grantTitle: "UTAPS",
        grantCategory: "Education", 
        submitted: true,
        submissionDate: new Date(),
        status: "Submitted",
        awarded: 0, 
        responses: [],
    },
    {
        id: 6,
        userID: 7,
        grantID: '65f6326d04249a6f006a9429',
        grantTitle: "UTAPS",
        grantCategory: "Education", 
        submitted: true,
        submissionDate: new Date(),
        status: "Submitted",
        awarded: 0, 
        responses: [],
    },
]