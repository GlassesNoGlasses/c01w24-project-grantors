const SERVER_URL = "http://localhost:8000";

test("/login - 400 Fields Missing Test", async() => {
  const signup = await fetch(`${SERVER_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      isAdmin: true,
      username: "alex",
      firstName: "alex",
      lastName: "zeng",
      email: "alex@mail",
      password: "123"
  })});

  const signup2 = await fetch(`${SERVER_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      isAdmin: false,
      username: "rawad",
      firstName: "rawad",
      lastName: "assi",
      email: "rawad@abou",
      password: "123"
  })});
  
  const attemptLogin1 = await fetch(`${SERVER_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    
  });

  const body1 = await attemptLogin1.json();

  expect(attemptLogin1.status).toBe(400);
  expect(body1['error']).toBe('Username and password both needed to login.');

  const username = 'not_registered'

  const attemptLogin2 = await fetch(`${SERVER_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username
      }),
  });

  const body2 = await attemptLogin2.json();

  expect(attemptLogin2.status).toBe(400);
  expect(body2['error']).toBe('Username and password both needed to login.');

  const password = 'password'

  const attemptLogin3 = await fetch(`${SERVER_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password
      }),
  });

  const body3 = await attemptLogin3.json();

  expect(attemptLogin3.status).toBe(400);
  expect(body3['error']).toBe('Username and password both needed to login.');
});

test("/login - 404 Username Not Found Test", async() => {
    const username = 'not_registered'
    const password = 'does_not_exist';

    const attemptLogin = await fetch(`${SERVER_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
    });

    const body = await attemptLogin.json();

    expect(attemptLogin.status).toBe(404);
    expect(body['error']).toBe('User Not Found');
});

test("/login - 404 Email Not Found Test", async() => {
  const email = 'null@mail.com'
  const password = 'does_not_exist';

  const attemptLogin = await fetch(`${SERVER_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
  });

  const body = await attemptLogin.json();

  expect(attemptLogin.status).toBe(404);
  expect(body['error']).toBe('User Not Found');
});

test("/login - 401 Username Exists but Incorrect Password Test", async() => {
  const username = 'alex'
  const password = 'wrong_password';

  const attemptLogin = await fetch(`${SERVER_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
  });

  const body = await attemptLogin.json();

  expect(attemptLogin.status).toBe(401);
  expect(body['error']).toBe('Incorrect Credentials');
});

test("/login - 401 Email Exists but Incorrect Password Test", async() => {
  const email = 'alex@mail'
  const password = 'wrong_password';

  const attemptLogin = await fetch(`${SERVER_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
  });

  const body = await attemptLogin.json();

  expect(attemptLogin.status).toBe(401);
  expect(body['error']).toBe('Incorrect Credentials');
});

test("/login - 200 Log In As Admin Using Username Test", async() => {
  const username = 'alex' // alex is an admin
  const password = '123'; // correct password

  const attemptLogin = await fetch(`${SERVER_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
  });

  const body = await attemptLogin.json();

  expect(attemptLogin.status).toBe(200);
  expect(body['isAdmin']).toBe(true);
});

test("/login - 200 Log In As Admin Using Email Test", async() => {
  const email = 'alex@mail' // alex is an admin
  const password = '123'; // correct password

  const attemptLogin = await fetch(`${SERVER_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
  });

  const body = await attemptLogin.json();

  expect(attemptLogin.status).toBe(200);
  expect(body['isAdmin']).toBe(true);
});

test("/login - 200 Log In As A Normal User Using Username Test", async() => {
  const username = 'rawad' // rawad is not an admin
  const password = '123'; // correct password

  const attemptLogin = await fetch(`${SERVER_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
  });

  const body = await attemptLogin.json();

  expect(attemptLogin.status).toBe(200);
  expect(body['isAdmin']).toBe(false);
  expect(body['email']).toBe('rawad@abou')
});

test("/login - 200 Log In As A Normal User Using Email Test", async() => {
  const email = 'rawad@abou' // rawad is not an admin
  const password = '123'; // correct password

  const attemptLogin = await fetch(`${SERVER_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
  });

  const body = await attemptLogin.json();

  expect(attemptLogin.status).toBe(200);
  expect(body['isAdmin']).toBe(false);
  expect(body['username']).toBe('rawad');
});