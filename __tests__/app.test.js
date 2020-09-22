const app = require("../app");
const request = require("supertest");
const connection = require("../connection");

afterAll(() => {
  return connection.destroy();
});

describe("/api", () => {
  describe("/topics", () => {
    it("GET /topics should return with a 200", () => {
      return request(app).get("/api/topics/").expect(200);
    });
    it("GET /topics should return a topics object with an array", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          expect(typeof res.body.topics).toBe("object");
        });
    });
  });
});
