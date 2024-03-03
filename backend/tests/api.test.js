const request = require('supertest');
const app = require('../server');

describe('POST /registerUser', () => {
  test('should register a new user', async () => {
    const res = await request(app)
      .post('/registerUser')
      .send({
        accountID: "ID",
        username: "username",
        email: "email",
        password: "password",
        firstName: "firstname",
        lastName: "lastname",
        isAdmin: false
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });
});