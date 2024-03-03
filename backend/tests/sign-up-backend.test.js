const SERVER_URL = "http://localhost:8000";

test("/resgisterUser - 201 Successful Registration", async() => {

  accountID = 'something',
  username = 'neil',
  email = "neil@mail.com",
  password = "123",
  firstName = "Neil",
  lastName = "Wang",
  isAdmin = false
  
  const signup = await fetch(`${SERVER_URL}/registerUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountID: accountID,
        username,
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        isAdmin: isAdmin
      }),
  });

  const body = await signup.json();

  expect(signup.status).toBe(201);
  expect(body['response']).toBe('User registered successfully.');
});