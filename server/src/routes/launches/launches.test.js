const request = require("supertest");

const app = require("../../app");

const { mongoConnect, mongoDisconnect } = require("../../services/mongo");
const { loadPlanetsData } = require("../../models/planets.model");

describe("Launches Api", () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  });

  // afterAll(async () => {
  //   await mongoDisconnect();
  // });

  describe("Test GET /launches", () => {
    test("is should respond with 200 success", async () => {
      await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test POST/launch", () => {
    const completeLaunchData = {
      mission: "USss",
      rocket: "Some target",
      target: "Kepler-62 f",
      launchDate: "January 4, 2013",
    };
    const launchWithoutDate = {
      mission: "USss",
      rocket: "Some target",
      target: "Kepler-62 f",
    };
    const launchDateWithInvalidDate = {
      mission: "USss",
      rocket: "Some target",
      target: "Kepler-62 f",
      launchDate: "asdsad",
    };

    test("is should respond with 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();

      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(response.body).toMatchObject(launchWithoutDate);
    });

    test("is should catch missing properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        error: "Missing required launch prop",
      });
    });
    test("is should catch invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDateWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        error: "Invalid date",
      });
    });
  });
});
