delete process.env.NODE_ENV

const request = require("supertest")
const app = require("../testServer")
const User = require("../modules/User")
const Category = require("../modules/Posts")
const {
  userOne,
  userOneIncorrectPassword,
  userTwo,
  userThree,
  admin,
  empty,
  doesntexists
} = require("./testConstants")

let adminToken = null
let userToken = null
let category = null
let categorytwo = null
let categoryThree = null

let postAdmin = null
let categoryPost = null
let categoryPostTwo = null

jest.setTimeout(30000)

beforeAll(async () => {
  await User.deleteMany()
  await Category.deleteMany()

  //Create user
  await request(app)
    .post("/api/users")
    .send(userOne)
    .expect(200)

  //Create admin
  await request(app)
    .post("/api/users")
    .send(admin)
    .expect(200)

  await request(app)
    .put("/api/users")
    .send(admin)
    .expect(200)

  //Get token for admin
  const tokAdmin = await request(app)
    .post("/api/auth")
    .send(admin)

  adminToken = JSON.parse(tokAdmin.res.text)

  //get token for user
  const tokUser = await request(app)
    .post("/api/auth")
    .send(userOne)

  userToken = JSON.parse(tokUser.res.text)

  //create first category
  await request(app)
    .post("/api/categories")
    .send({
      name: "cat99999"
    })
    .set("x-auth-token", `${adminToken.token}`)
    .expect(200)

  category = await Category.findOne({ name: "cat99999" })

  //create second category
  const other = await request(app)
    .post("/api/categories")
    .send({
      name: "cat777"
    })
    .set("x-auth-token", `${adminToken.token}`)
    .expect(200)

  categorytwo = await Category.findOne({ name: "cat777" })

  //create third category
  await request(app)
    .post("/api/categories")
    .send({
      name: "cat000"
    })
    .set("x-auth-token", `${adminToken.token}`)
    .expect(200)

  categoryThree = await Category.findOne({ name: "cat000" })

  //create post for category
  const cat = await request(app)
    .post("/api/categories/" + categoryThree._id + "/posts")
    .send({
      text: "assasaa"
    })
    .set("x-auth-token", `${adminToken.token}`)

  categoryPost = cat.body.posts.find(x => x.text == "assasaa")

  //create second post for category
  const cat2 = await request(app)
    .post("/api/categories/" + categoryThree._id + "/posts")
    .send({
      text: "assasaassss"
    })
    .set("x-auth-token", `${adminToken.token}`)

  categoryPostTwo = cat2.body.posts.find(x => x.text == "assasaassss")

  postAdmin = await User.findOne({ name: "Admin" })
})

afterAll(async () => {
  //     await User.deleteMany()
  //   await Category.deleteMany()
})

// --CATEGORIES--

// --POST--

test("Admin create category", async () => {
  await request(app)
    .post("/api/categories")
    .send({
      name: "cat999"
    })
    .set("x-auth-token", `${adminToken.token}`)
    .expect(200)
})

test("Category already exists", async () => {
  await request(app)
    .post("/api/categories")
    .send({
      name: "cat999"
    })
    .set("x-auth-token", `${adminToken.token}`)
    .expect(400)
})

test("Admin create category without name", async () => {
  await request(app)
    .post("/api/categories")
    .send({
      name: ""
    })
    .set("x-auth-token", `${adminToken.token}`)
    .expect(400)
})

test("Not admin trying to create category", async () => {
  await request(app)
    .post("/api/categories")
    .send({
      name: "cat9999"
    })
    .set("x-auth-token", `${userToken.token}`)
    .expect(403)
})

// --GET ID--

test("Get category by id", async () => {
  await request(app)
    .get("/api/categories/" + category._id)
    .expect(200)
})

test("Category with wrong id", async () => {
  await request(app)
    .get("/api/categories/" + category._id + "15264561")
    .expect(404)
})

// --GET All--

test("Get all categories", async () => {
  await request(app)
    .get("/api/categories/")
    .expect(200)
})

// --Update--

test("Admin update category", async () => {
  await request(app)
    .put("/api/categories/" + category._id)
    .send({
      name: "cat99945"
    })
    .set("x-auth-token", `${adminToken.token}`)
    .expect(200)
})

test("Admin update category with wrong id", async () => {
  await request(app)
    .put("/api/categories/" + category._id + "15642")
    .send({
      name: "cat99945"
    })
    .set("x-auth-token", `${adminToken.token}`)
    .expect(404)
})

test("Admin update category with empty fields", async () => {
  await request(app)
    .put("/api/categories/" + category._id)
    .send({
      name: ""
    })
    .set("x-auth-token", `${adminToken.token}`)
    .expect(400)
})

test("User update category", async () => {
  await request(app)
    .put("/api/categories/" + category._id)
    .send({
      name: "cat9999"
    })
    .set("x-auth-token", `${userToken.token}`)
    .expect(403)
})

// --Delete--

test("User delete category", async () => {
  await request(app)
    .delete("/api/categories/" + categorytwo._id)
    .set("x-auth-token", `${userToken.token}`)
    .expect(403)
})

test("Admin delete category with wrong id", async () => {
  await request(app)
    .delete("/api/categories/" + categorytwo._id + "145245")
    .set("x-auth-token", `${adminToken.token}`)
    .expect(404)
})

test("Admin delete category with wrong id", async () => {
  await request(app)
    .delete("/api/categories/" + categorytwo._id + "")
    .set("x-auth-token", `${adminToken.token}`)
    .expect(200)
})

//--POSTS--

//--CREATE--

test("Add post to category", async () => {
  await request(app)
    .post("/api/categories/" + categoryThree._id + "/posts")
    .send({
      text: "fdsfsdf"
    })
    .set("x-auth-token", `${adminToken.token}`)
    .expect(200)
})

test("Add post to category with empy field", async () => {
  await request(app)
    .post("/api/categories/" + categoryThree._id + "/posts")
    .send({
      text: ""
    })
    .set("x-auth-token", `${adminToken.token}`)
    .expect(400)
})

test("Add post to category that doesn't exist", async () => {
  await request(app)
    .post("/api/categories/" + categorytwo._id + "/posts")
    .send({
      text: "fdsfddsdf"
    })
    .set("x-auth-token", `${adminToken.token}`)
    .expect(404)
})

//--GETBYID--

test("Get posts from category by id", async () => {
  await request(app)
    .get("/api/categories/" + categoryThree._id + "/posts/" + categoryPost._id)
    .set("x-auth-token", `${adminToken.token}`)
    .expect(200)
})

test("Get posts from category by id when category doesnt exists", async () => {
  await request(app)
    .get("/api/categories/" + categorytwo._id + "/posts/" + categoryPost._id)
    .set("x-auth-token", `${adminToken.token}`)
    .expect(404)
})

test("Get posts from category by id when post doesnt exists", async () => {
  await request(app)
    .get("/api/categories/" + categoryThree._id + "/posts/" + categorytwo._id)
    .set("x-auth-token", `${adminToken.token}`)
    .expect(404)
})

test("Get posts from category by id when is are wrong", async () => {
  await request(app)
    .get(
      "/api/categories/" +
        categoryThree._id +
        "15245" +
        "/posts/" +
        categorytwo._id
    )
    .set("x-auth-token", `${adminToken.token}`)
    .expect(404)
})

//--GETALL--

test("Get posts from category", async () => {
  await request(app)
    .get("/api/categories/" + categoryThree._id + "/posts")
    .set("x-auth-token", `${adminToken.token}`)
    .expect(200)
})

test("Get post from category when category doesn't exists", async () => {
  await request(app)
    .get("/api/categories/" + categorytwo._id + "/posts")
    .set("x-auth-token", `${adminToken.token}`)
    .expect(404)
})

//--UPDATE

test("Update post with admin", async () => {
  await request(app)
    .put("/api/categories/" + categoryThree._id + "/posts/" + categoryPost._id)
    .send({
      text: "fdsfddsdfsfsf"
    })
    .set("x-auth-token", `${adminToken.token}`)
    .expect(200)
})

test("Update post with admin and empty fields", async () => {
  await request(app)
    .put("/api/categories/" + categoryThree._id + "/posts/" + categoryPost._id)
    .send({
      text: ""
    })
    .set("x-auth-token", `${adminToken.token}`)
    .expect(400)
})

test("Update post with admin and wrong id", async () => {
  await request(app)
    .put(
      "/api/categories/" +
        categoryThree._id +
        "542fsfs" +
        "/posts/" +
        categoryPost._id
    )
    .send({
      text: "dasdasdas"
    })
    .set("x-auth-token", `${adminToken.token}`)
    .expect(404)
})

test("Update post when category doesnt exists", async () => {
  await request(app)
    .put("/api/categories/" + categorytwo._id + "/posts/" + categoryPost._id)
    .send({
      text: "fdsfdsfdsfds"
    })
    .set("x-auth-token", `${adminToken.token}`)
    .expect(404)
})

test("Update post when post doesn't exists", async () => {
  await request(app)
    .put("/api/categories/" + categoryThree._id + "/posts/" + categorytwo._id)
    .send({
      text: "sffdfsfds"
    })
    .set("x-auth-token", `${adminToken.token}`)
    .expect(404)
})

test("Update post with user", async () => {
  await request(app)
    .put(
      "/api/categories/" + categoryThree._id + "/posts/" + categoryPostTwo._id
    )
    .send({
      text: "fdsfddsdfsfsf"
    })
    .set("x-auth-token", `${userToken.token}`)
    .expect(403)
})

//--DELETE--

test("Delete post with admin and wrong id", async () => {
  await request(app)
    .delete(
      "/api/categories/" +
        categoryThree._id +
        "542fsfs" +
        "/posts/" +
        categoryPostTwo._id
    )
    .send({
      text: "dasdasdas"
    })
    .set("x-auth-token", `${adminToken.token}`)
    .expect(404)
})

test("Delete post when category doesnt exists", async () => {
  await request(app)
    .delete("/api/categories/" + categorytwo._id + "/posts/" + categoryPostTwo._id)
    .send({
      text: "fdsfdsfdsfds"
    })
    .set("x-auth-token", `${adminToken.token}`)
    .expect(404)
})

test("Delete post with user", async () => {
  await request(app)
    .delete(
      "/api/categories/" + categoryThree._id + "/posts/" + categoryPostTwo._id
    )
    .send({
      text: "fdsfddsdfsfsf"
    })
    .set("x-auth-token", `${userToken.token}`)
    .expect(403)
})

test("Delete post with admin", async () => {
  await request(app)
    .delete(
      "/api/categories/" + categoryThree._id + "/posts/" + categoryPostTwo._id
    )
    .set("x-auth-token", `${adminToken.token}`)
    .expect(200)
})

test("Delete post when post doesn't exists", async () => {
  await request(app)
    .delete(
      "/api/categories/" + categoryThree._id + "/posts/" + categoryPostTwo._id
    )
    .send({
      text: "sffdfsfds"
    })
    .set("x-auth-token", `${adminToken.token}`)
    .expect(404)
})
