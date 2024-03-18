const SERVER_URL = "http://localhost:8000";

let accId = ''
let gId1 = ''
let gId2 = ''

test("/createGrant - 201 Grant Saved (Not Published) to MongoDB", async() => {

    const signup = await fetch(`${SERVER_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isAdmin: false,
          username: "dude",
          firstName: "neil",
          lastName: "broski",
          email: "neily@mail",
          password: "123"
    })});

    const lol = signup.json().then((data) => {
        accId = data['id']
    })

    const res = await fetch(`${SERVER_URL}/createGrant`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'title': 'test', 'description': 'test grant', 
        'deadline': "2024-03-13T00:16:33.451Z", 'minAmount': 0, "maxAmount": 1, 'organization': 'us',
        'category': 'one', "contact": 'my number', 'questions': [], 'publish': false }),
    })

    const lmao = res.json().then((data) => {
        gId1 = data['id']
    })

    expect(res.status).toBe(201)
})

test("/createGrant - 201 Grant Saved (Published) to MongoDB", async() => {

    const res = await fetch(`${SERVER_URL}/createGrant`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'title': 'publish', 'description': 'publish grant', 
        'deadline': "2024-03-13T00:16:33.451Z", 'minAmount': 0, "maxAmount": 1, 'organization': 'us',
        'category': 'one', "contact": 'my number', 'questions': [], 'publish': false }),
    })

    res.json().then((data) => {
        gId2 = data['id']
    })

    expect(res.status).toBe(201)
})




test("/getGrant - 404 grant not found", async() => {

    const res = await fetch(`${SERVER_URL}/getGrant/65f10e1400bf9f0f260c331c`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
    })

    const body = await res.json()

    expect(res.status).toBe(404)
    expect(body['error']).toBe("Unable to find grant with given ID.")
})




test("/getGrant - 200 published grant found", async() => {

    const res = await fetch(`${SERVER_URL}/getGrant/${gId2}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
    })

    const body = await res.json()

    expect(res.status).toBe(200)
})



test("/editGrant - 201 unpublished grant edited", async() => {

    const res = await fetch(`${SERVER_URL}/editGrant/${gId1}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'accId': accId, 'title': 'test edited', 'description': 'test grant', 
        'deadline': "2024-03-13T00:16:33.451Z", 'minAmount': 0, "maxAmount": 1, 'organization': 'us',
        'category': 'one', "contact": 'my number', 'questions': [], 'publish': false }),
    })

    const resp = await fetch(`${SERVER_URL}/getGrant/${gId1}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
    });

    const body = await resp.json();

    expect(res.status).toBe(201);
    expect(body['response'].title).toBe('test edited');
})

test("/deleteGrant - 201 unpublished grant deleted", async() => {

    const res = await fetch(`${SERVER_URL}/deleteGrant/${gId1}`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        },
    })

    const resp = await fetch(`${SERVER_URL}/getGrant/${gId1}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
    })

    expect(res.status).toBe(200)
    expect(resp.status).toBe(404)
})
