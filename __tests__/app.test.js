const app = require("../app");
const request = require("supertest");
const connection = require("../connection");

afterAll(() => {
  return connection.destroy();
});

describe("/api", () => {
  it("GET requests to invalid paths produce a 404", () => {
    return request(app).get("/api/jopikz").expect(404);
  });
  describe("/topics", () => {
    it("GET /topics should return a 200 and a topics object with an array", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          expect(typeof res.body.topics).toBe("object");
        });
    });
  });
  describe("/users", () => {
    it("GET /users/:username should return a 200 and an object", () => {
      return request(app)
        .get("/api/users/lurker")
        .expect(200)
        .then((res) => {
          expect(typeof res.body.user).toBe("object");
        });
    });
    it("GET /users/:username should return an object with the correct keys and the correct username", () => {
      return request(app)
        .get("/api/users/lurker")
        .expect(200)
        .then((res) => {
          expect(Object.keys(res.body.user)).toEqual(
            expect.arrayContaining(["avatar_url", "name", "username"])
          );
          expect(res.body.user.username).toBe("lurker");
        });
    });
    it("GET /users/:username should return a 404 if passed a valid user id but no user is found", () => {
      return request(app)
        .get("/api/users/lurk3r")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("User not found");
        });
    });
  });
  describe("/articles", () => {
    describe("GET", () => {
      it("/articles responds with an array of article objects that include a comment count for each article", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((res) => {
            const keys = [
              `author`,
              `title`,
              `article_id`,
              `topic`,
              `created_at`,
              `votes`,
              "comment_count",
            ];
            expect(
              res.body.articles.every((article) => {
                let bool = true;
                Object.keys(article).forEach((key) => {
                  if (!keys.includes(key)) bool = false;
                });
                return bool;
              })
            );
          });
      });
      it("/articles should accept a sort_by query which defaults to created_at", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((res) => {
            expect(res.body.articles).toBeSortedBy("created_at", {
              descending: true,
            });
            return request(app)
              .get("/api/articles?sort_by=votes")
              .expect(200)
              .then((res) => {
                expect(res.body.articles).toBeSortedBy("votes", {
                  descending: true,
                });
              });
          });
      });
      it("/articles should accept an order_by query which defaults to descending", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((res) => {
            expect(res.body.articles).toBeSortedBy("created_at", {
              descending: true,
            });
            return request(app).get(
              "/api/articles?sort_by=votes&&order_by=asc",
              {
                ascending: true,
              }
            );
          });
      });
      it("/articles should accept an author query, that filters to only authors we are interested in", () => {
        return request(app)
          .get("/api/articles?author=icellusedkars")
          .expect(200)
          .then((res) => {
            expect(
              res.body.articles.every(
                (article) => article.author === "icellusedkars"
              )
            ).toBe(true);
          });
      });
      it("/articles should accept an author query, that filters to only authors we are interested in", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then((res) => {
            expect(
              res.body.articles.every((article) => article.topic === "mitch")
            ).toBe(true);
          });
      });
      it("/articles/:article_id should return a 200 and a single-object array with the correct article", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then((res) => {
            expect(Array.isArray(res.body.article)).toBe(true);
            expect(res.body.article.length).toBe(1);
            expect(res.body.article[0].article_id).toBe(1);
            expect(res.body.article[0].comment_count).toBe("13");
          });
      });
      it("/articles/:article_id should return a 404 if a valid id is passed but no article is found", () => {
        return request(app)
          .get("/api/articles/1000000000")
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("Article not found");
          });
      });
      it("/articles/:article_id should return a 400 bad request if an invalid id is passed", () => {
        return request(app)
          .get("/api/articles/banana")
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("Bad request");
          });
      });
      it("/articles/:article_id/comments should return a 200 and an array of comments with the correct properties", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then((res) => {
            console.log(res.body.comments);
            expect(Array.isArray(res.body.comments)).toBe(true);
            const keys = [
              `author`,
              `comment_id`,
              `article_id`,
              `body`,
              `created_at`,
              `votes`,
            ];
            expect(
              res.body.comments.every((comment) => {
                let bool = true;
                Object.keys(comment).forEach((key) => {
                  if (!keys.includes(key)) bool = false;
                });
                return bool;
              })
            ).toEqual(true);
          });
      });
      it("/articles/:article_id/comments should by sorted by created_at descending by default", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then((res) => {
            expect(res.body.comments).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
      it("/articles/:article_id/comments should accept a sort_by query", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=author")
          .expect(200)
          .then((res) => {
            expect(res.body.comments).toBeSortedBy("author", {
              descending: true,
            });
          });
      });
      it("/articles/:article_id/comments should accept an order_by query", () => {
        return request(app)
          .get("/api/articles/1/comments?order_by=asc")
          .expect(200)
          .then((res) => {
            expect(res.body.comments).toBeSortedBy("created_at", {
              ascending: true,
            });
          });
      });
      it("/articles/:article_id/comments should be able to use its two valid queries together", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=author&order_by=asc")
          .expect(200)
          .then((res) => {
            expect(res.body.comments).toBeSortedBy("author", {
              ascending: true,
            });
          });
      });
    });
    describe("DELETE", () => {
      it("/articles/:article_id should return the number of deleted rows and the deleted article", () => {
        return request(app)
          .del("/api/articles/2")
          .expect(200)
          .then((res) => {
            expect(res.body.rows_deleted).toBe(1);
            expect(res.body.article).toEqual({
              article_id: 2,
              title: "Sony Vaio; or, The Laptop",
              topic: "mitch",
              author: "icellusedkars",
              body:
                "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
              created_at: "2014-11-16T12:21:54.171Z",
              votes: 0,
            });
          });
      });
      it("/articles/:article_id should return a 404 if a valid id is passed but no article is found", () => {
        return request(app)
          .del("/api/articles/1000000000")
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("Article not found");
          });
      });
      it("/articles/:article_id should return a 400 bad request if an invalid id is passed", () => {
        return request(app)
          .del("/api/articles/banana")
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("Bad request");
          });
      });
    });
    describe("PATCH", () => {
      it("/articles/:article_id should return a correctly-updated article object", () => {
        return request(app)
          .patch("/api/articles/3")
          .expect(200)
          .send({ inc_votes: 5 })
          .then((res) => {
            expect(res.body.article).toEqual({
              article_id: 3,
              title: "Eight pug gifs that remind me of mitch",
              topic: "mitch",
              votes: 5,
              author: "icellusedkars",
              body: "some gifs",
              created_at: "2010-11-17T12:21:54.171Z",
            });
          });
      });
      it("/articles/:article_id should return a 404 if a valid id is passed but no article is found", () => {
        return request(app)
          .patch("/api/articles/1000000000")
          .send({ votes: 5 })
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("Article not found");
          });
      });
      it("/articles/:article_id should return a 400 bad request if an invalid id is passed", () => {
        return request(app)
          .patch("/api/articles/banana")
          .send({ votes: 5 })
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("Bad request");
          });
      });
      it("/articles/:article_id should return a 200 and an unchanged object if a body with irrelevant properties is passed ", () => {
        return request(app)
          .patch("/api/articles/3")
          .send({ boats: 5, Test: true })
          .expect(200)
          .then((res) => {
            expect(res.body.article).toEqual({
              article_id: 3,
              title: "Eight pug gifs that remind me of mitch",
              body: "some gifs",
              votes: 5,
              topic: "mitch",
              author: "icellusedkars",
              created_at: "2010-11-17T12:21:54.171Z",
            });
          });
      });
    });
    describe("POST", () => {
      it("/articles/:article_id/comments should return a correctly-updated article object", () => {
        return request(app)
          .post("/api/articles/4/comments")
          .expect(201)
          .send({ username: "icellusedkars", body: "this is a test comment" })
          .then((res) => {
            expect(res.body.comment.author).toBe("icellusedkars");
            expect(res.body.comment.article_id).toBe(4);
            expect(res.body.comment.body).toBe("this is a test comment");
          });
      });
      it("/articles/:article_id/comments should return a 404 if a valid id is passed but no article is found", () => {
        return request(app)
          .post("/api/articles/1000000000/comments")
          .send({ username: "icellusedkars", body: "this is a test comment" })
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("Article not found");
          });
      });
      it("/articles/:article_id/comments should return a 400 bad request if an invalid id is passed", () => {
        return request(app)
          .post("/api/articles/banana/comments")
          .send({ username: "icellusedkars", body: "this is a test comment" })
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("Bad request");
          });
      });
      it("/articles/:article_id/comments should return a 400 invalid body message if an invalid body is passed", () => {
        return request(app)
          .post("/api/articles/3/comments")
          .send({ user: "icellusedkars", face: "this is a test comment" })
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("Invalid body");
          });
      });
    });
  });
  describe("/comments", () => {
    describe("PATCH", () => {
      it("/comments/:comment_id should accept a query body that updates the votes property of the specified comment by 1 or -1", () => {
        return Promise.all([
          request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 1 })
            .expect(200),
          request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: -2 })
            .expect(200),
        ]).then((results) => {
          expect(results[0].body.comment.votes).toBe(17);
          expect(results[1].body.comment.votes).toBe(15);
        });
      });
    });
    describe("DELETE", () => {
      it.only("/comments/:comment_id should delete the specified comment and return no content", () => {
        return request(app)
          .del("/api/comments/1")
          .expect(204)
          .then((res) => {
            expect(res.body).toEqual({});
          });
      });
    });
  });
});

/*errors to code:

invalid query values for /articles GET query tests - e.g. sort by banana
invalid query properties for /articles GET query tests - e.g. banana=yellow 
everything form line 264 of the readme*/
