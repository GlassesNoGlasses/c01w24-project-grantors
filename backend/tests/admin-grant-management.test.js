const SERVER_URL = "http://localhost:8000";

let accId = ''
let gId1 = ''
let gId2 = ''

test("POST /grant - 201 Grant Saved (Not Published) to MongoDB", async() => {
    const res = await fetch(`${SERVER_URL}/grant`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'title': 'test', 'description': 'test grant', 
        'deadline': "2024-03-13T00:16:33.451Z", 'minAmount': 0, "maxAmount": 1, 'organization': 'us',
        'category': 'one', "contact": 'my number', 'questions': [], 'publish': false }),
    });

    await res.json().then((data) => {
        gId1 = data['id']
    });

    expect(res.status).toBe(201);
})

test("POST /grant - 201 Grant Saved (Published) to MongoDB", async() => {

    const res = await fetch(`${SERVER_URL}/grant`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'title': 'publish', 'description': 'publish grant', 
        'deadline': "2024-03-13T00:16:33.451Z", 'minAmount': 0, "maxAmount": 1, 'organization': 'us',
        'category': 'one', "contact": 'my number', 'questions': [], 'publish': false }),
    });

    await res.json().then((data) => {
        gId2 = data['id']
    });

    expect(res.status).toBe(201);
});

test("GET /grant - 404 grant not found", async() => {

    const res = await fetch(`${SERVER_URL}/grant/65f10e1400bf9f0f260c331c`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
    });

    const body = await res.json();

    expect(res.status).toBe(404)
    expect(body['error']).toBe("Unable to find grant with given ID.")
});

test("GET /grant - 200 published grant found", async() => {

    const res = await fetch(`${SERVER_URL}/grant/${gId2}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
    });

    expect(res.status).toBe(200);
});

test("PUT /grant - 201 unpublished grant edited", async() => {

    const res = await fetch(`${SERVER_URL}/grant/${gId1}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'title': 'test edited', 'description': 'test grant', 
        'deadline': "2024-03-13T00:16:33.451Z", 'minAmount': 0, "maxAmount": 1, 'organization': 'us',
        'category': 'one', "contact": 'my number', 'questions': [], 'publish': false }),
    });

    const resp = await fetch(`${SERVER_URL}/grant/${gId1}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
    });

    const body = await resp.json();

    expect(res.status).toBe(201);
    expect(body['response'].title).toBe('test edited');
});

test("DELETE /grant - 201 unpublished grant deleted", async() => {

    const res = await fetch(`${SERVER_URL}/grant/${gId1}`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        },
    });

    const resp = await fetch(`${SERVER_URL}/grant/${gId1}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
    });

    expect(res.status).toBe(200);
    expect(resp.status).toBe(404);
});