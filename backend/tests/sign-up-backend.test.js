const SERVER_URL = "http://localhost:8000";

const username = 'neil';
const email = "neil@mail.com";
const password = "123";
const firstName = "Neil";
const lastName = "Wang";
const isAdmin = false;

test("/signup - 201 Successful Registration", async() => {
  
  const signup = await fetch(`${SERVER_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        isAdmin: isAdmin,
      }),
  });

  const body = await signup.json();

  expect(signup.status).toBe(201);
  expect(body['response']).toBe('User registered successfully.');
});

test("/signup - 400 User Already in Database", async() => {

  const signup = await fetch(`${SERVER_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        isAdmin: isAdmin
      }),
  });

  const body = await signup.json();

  expect(signup.status).toBe(400);
  expect(body['error']).toBe('User already exists.');
});

describe("/signup - 400 Test Missing Fields", () => {
  test("/signup - 400 Missing Email", async() => {
    
    const signup = await fetch(`${SERVER_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          firstName: firstName,
          lastName: lastName,
          isAdmin: isAdmin
        }),
    });
  
    const body = await signup.json();
  
    expect(signup.status).toBe(400);
    expect(body['error']).toBe('Username and email and password are all needed to register.');
  }),
  test("/signup - 400 Missing Username", async() => {
    
    const signup = await fetch(`${SERVER_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
          isAdmin: isAdmin
        }),
    });
  
    const body = await signup.json();
  
    expect(signup.status).toBe(400);
    expect(body['error']).toBe('Username and email and password are all needed to register.');
  }),
  test("/signup - 400 Missing Password", async() => {
    
    const signup = await fetch(`${SERVER_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          firstName: firstName,
          lastName: lastName,
          isAdmin: isAdmin
        }),
    });
  
    const body = await signup.json();
  
    expect(signup.status).toBe(400);
    expect(body['error']).toBe('Username and email and password are all needed to register.');
  })
})