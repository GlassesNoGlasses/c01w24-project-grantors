const SERVER_URL = "http://localhost:8000";

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
  expect(body['admin']).toBe(true);
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
  expect(body['admin']).toBe(true);
});

test("/login - 200 Log In As A Normal User Using Username Test", async() => {
  const username = 'rawad' // rawad is an admin
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
  expect(body['admin']).toBe(false);
});

test("/login - 200 Log In As A Normal User Using Email Test", async() => {
  const email = 'rawad@abou' // rawad is an admin
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
  expect(body['admin']).toBe(false);
});
