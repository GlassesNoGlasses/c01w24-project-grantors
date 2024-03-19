const SERVER_URL = "http://localhost:8000";

let user;

beforeAll(async () => {
    await fetch(`${SERVER_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isAdmin: true,
          username: "favouritesTest",
          firstName: "fav",
          lastName: "test",
          email: "fav@test.com",
          password: "123"
        })
    });

    const loginRes = await fetch(`${SERVER_URL}/login`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: "favouritesTest",
            password: "123",
        }),
    });

    await loginRes.json().then((data) => user = data);
});

test("PATCH /users/:userID/favourites - 404 invalid userID", async () => {
    const response = await fetch(`${SERVER_URL}/users/123456789112345678921234/favourites`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ grantID: '1' }),
            });
    expect(response.status).toBe(404);
});

test("PATCH /users/:userID/favourites - 400 missing grantID", async () => {
    const response = await fetch(`${SERVER_URL}/users/${user.accountID}/favourites`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    expect(response.status).toBe(400);
});

test("PATCH /users/:userID/favourites - 200 favourite grant toggled", async () => {
    const response = await fetch(`${SERVER_URL}/users/${user.accountID}/favourites`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ grantID: '65f62c34a63772d89e324d2b' }),
            });
    expect(response.status).toBe(200);
});

test("GET /users/:userID/favourites - 200 favourite grant returned", async () => {
    const response = await fetch(`${SERVER_URL}/users/${user.accountID}/favourites`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    const favouriteGrants = await response.json().then((data) => data.response);

    expect(response.status).toBe(200);
    expect(favouriteGrants[0].id).toBe('65f62c34a63772d89e324d2b');
});