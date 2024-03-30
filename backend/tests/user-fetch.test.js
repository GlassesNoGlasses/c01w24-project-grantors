const SERVER_URL = "http://localhost:8000";

const testUser = {
    accountID: "",
    username: "bob",
    email: "test@test.com",
    password: "test",
    firstName: "test",
    lastName: "test",
    isAdmin: false,
    organization: null,
    authToken: "",
};

beforeAll(async () => {
    // Sign up test user
    await fetch(`${SERVER_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testUser),
    });

    // Log in test user
    const login = await fetch(`${SERVER_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: testUser.username,
          password: testUser.password,
        }),
    });

    // Get token
    const body = await login.json();
    testUser.accountID = body.accountID;
    testUser.authToken = body.authToken;
});

test("/user - 401 Unauthroized Test", async () => {
  const res = await fetch(`${SERVER_URL}/user`, {
    headers: {
      "Authorization": "bearer 1234",
    },
  });

  expect(res.status).toBe(401);
  expect(res.statusText).toBe('Unauthorized');
});

test("/user - 200 User Found", async () => {
    const res = await fetch(`${SERVER_URL}/user`, {
        headers: {
        "Authorization": `bearer ${testUser.authToken}`,
        },
    });
    
    const body = await res.json().then((data) => data.response);
    
    expect(res.status).toBe(200);
    expect(body.accountID).toBe(testUser.accountID);
    expect(body.username).toBe(testUser.username);
    expect(body.email).toBe(testUser.email);
    expect(body.firstName).toBe(testUser.firstName);
    expect(body.lastName).toBe(testUser.lastName);
    expect(body.isAdmin).toBe(testUser.isAdmin);
    expect(body.organization).toBe(testUser.organization);
    expect(body.authToken).toBe(testUser.authToken);
});
