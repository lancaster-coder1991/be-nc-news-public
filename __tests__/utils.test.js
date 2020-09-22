const {
  replaceKeys,
  referenceObj,
  reformatDate,
} = require("../db/utils/data-manipulation");

describe("referenceObj", () => {
  let compArr;
  beforeEach(() => {
    compArr = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
      {
        article_id: 2,
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body:
          "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: 1416140514171,
      },
    ];
  });

  it("Returns an object", () => {
    expect(typeof referenceObj(compArr, "title", "article_id")).toBe("object");
  });
  it("Returns an object with the correct key value pairs", () => {
    const result = referenceObj(compArr, "title", "article_id");

    expect(result).toEqual({
      "Living in the shadow of a great man": 1,
      "They're not exactly dogs, are they?": 2,
    });
  });
});

describe("replaceKeys", () => {
  let changeArr;
  let refObj;
  beforeEach(() => {
    changeArr = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389,
      },
    ];
    refObj = {
      "Living in the shadow of a great man": 1,
      "They're not exactly dogs, are they?": 2,
    };
  });

  it("Returns a new array and doesnt mutate the orginal array or objects", () => {
    const result = replaceKeys(changeArr, refObj);
    expect(changeArr).toEqual([
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389,
      },
    ]);
    expect(result).not.toBe(changeArr);
  });
  it("Correctly updates the specified properties in each object", () => {
    const result = replaceKeys(changeArr, refObj);
    const keys = Object.keys(result[0]);
    expect(keys).toEqual(
      expect.arrayContaining([
        "author",
        "article_id",
        "votes",
        "body",
        "created_at",
      ])
    );
  });
  it("Assigns the correct id to the correct comment", () => {
    const result = replaceKeys(changeArr, refObj);
    expect(result[0].article_id).toBe(2);
    expect(result[1].article_id).toBe(1);
  });
});

describe.only("Reformat created_at date", () => {
  let arr;
  beforeEach(() => {
    arr = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: 1416140514171,
      },
    ];
  });
  it("return an array of objects", () => {
    expect(Array.isArray(reformatDate(arr))).toBe(true);
    expect(typeof reformatDate(arr)[0]).toBe("object");
  });
  it("changes the created_at property to SQL format", () => {
    console.log(new Date(1542284514171));
    expect(reformatDate(arr)[0].created_at).toEqual(new Date(1542284514171));
  });
});
