const request = require("supertest");
const db = require("../data/dbConfig");
const server = require("./server");

const nick = { name: "Nick" };
const bob = { name: "Bob" };

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db("users").truncate();
});

afterAll(async () => {
  await db.destroy();
});

describe("server tests", () => {
  describe("[GET] /users", () => {
    it("responds with 200 ok", async () => {
      const res = await request(server).get("/users");
      expect(res.status).toBe(200);
    });
    it("returns the right number of users", async () => {
      let res;
      await db("users").insert(nick);
      res = await request(server).get("/users");
      expect(res.body).toHaveLength(1);

      await db("users").insert(bob);
      res = await request(server).get("/users");
      expect(res.body).toHaveLength(2);
    });

    it("returns right format for users", async () => {
      await db("users").insert(nick);
      await db("users").insert(bob);
      const res = await request(server).get("/users");
      expect(res.body[0]).toMatchObject({ id: 1, ...nick });
      expect(res.body[1]).toMatchObject({ id: 2, ...bob });
    });
  });
  describe("[POST] /users", () => {
    it("responds with newly created user", async () => {
      let res;
      res = await request(server).post("/users").send(nick);
      expect(res.body).toMatchObject({ id: 1, ...nick });

      res = await request(server).post("/users").send(bob);
      expect(res.body).toMatchObject({ id: 2, ...bob });
    });
  });
  describe("[DELETE] /users", () => {
    it("responds with deleted user", async () => {
      await db("users").insert(nick);
      await db("users").insert(bob);

      let res;

      res = await request(server).delete("/users/1");
      expect(res.body).toMatchObject({ id: 1, ...nick });

      res = await request(server).delete("/users/2");
      expect(res.body).toMatchObject({ id: 2, ...bob });
    });
  });
});
