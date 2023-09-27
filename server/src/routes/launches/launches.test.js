const request = require("supertest");

const app = require("../../app");

describe("Test GET /launches", () => {
  test("is should respond with 200 success", async () => {
    await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("Test POST/launch", () => {
  const completeLaunchData = {
    mission: "USss",
    rocket: "Some target",
    target: "Kepler 12",
    launchDate: "January 4, 2013",
  };
  const launchWithoutDate = {
    mission: "USss",
    rocket: "Some target",
    target: "Kepler 12",
  };
  const launchDateWithInvalidDate = {
    mission: "USss",
    rocket: "Some target",
    target: "Kepler 12",
    launchDate: "asdsad",
  };

  test("is should respond with 200 success", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeLaunchData)
      .expect("Content-Type", /json/)
      .expect(201);

    const requestDate = new Date(completeLaunchData.launchDate).valueOf();

    const responseDate = new Date(response.body.launchDate).valueOf();

    expect(requestDate).toBe(responseDate);

    expect(response.body).toMatchObject(launchWithoutDate);
  });
  test("is should catch missing properties", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchWithoutDate)
      .expect("Content-Type", /json/)
      .expect(400);
    expect(response.body).toStrictEqual({
      error: "Missing required launch prop",
    });
  });
  test("is should catch invalid dates", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDateWithInvalidDate)
      .expect("Content-Type", /json/)
      .expect(400);
    expect(response.body).toStrictEqual({
      error: "Invalid date",
    });
  });
});
