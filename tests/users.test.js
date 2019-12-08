delete process.env.NODE_ENV

const request = require("supertest")
const app = require("../testServer")
const User = require("../modules/User")
const {
  userOne,
  userOneIncorrectPassword,
  userTwo,
  admin,
  userThree,
  empty,
  doesntexists
} = require("./testConstants")

beforeAll(async () => {
  await User.deleteMany()

  await request(app)
    .post("/api/users")
    .send(userThree)
    .expect(200)
})


// --USER TESTING--

test("Update user to admin", async () => {
  await request(app)
    .put("/api/users")
    .send(userThree)
    .expect(200)
})

test("Update user to admin with empty values", async () => {
  await request(app)
    .put("/api/users")
    .send(empty)
    .expect(400)
})

test("Update user to admin when user doesnt exists", async () => {
  await request(app)
    .put("/api/users")
    .send(doesntexists)
    .expect(400)
})

test("Create new user", async () => {
  await request(app)
    .post("/api/users")
    .send(userTwo)
    .expect(200)
})

test("Create same user", async () => {
  await request(app)
    .post("/api/users")
    .send(userTwo)
    .expect(400)
})

test("User log in with empty values", async () => {
  await request(app)
    .post("/api/users")
    .send(empty)
    .expect(400)
})

test("User log in with empty values", async () => {
  await request(app)
    .post("/api/users")
    .send(empty)
    .expect(400)
})

// --AUTH TESTING--

test("User log in with corect data", async () => {
  await request(app)
    .post("/api/auth")
    .send(userTwo)
    .expect(200)
})

test("User log in with incorrect fields", async () => {
  await request(app)
    .post("/api/auth")
    .send(doesntexists)
    .expect(400)
})

test("User log in with incorrect password", async () => {
  await request(app)
    .post("/api/auth")
    .send(userOneIncorrectPassword)
    .expect(400)
})

test("User log in with empty values", async () => {
  await request(app)
    .post("/api/auth")
    .send(empty)
    .expect(400)
})
