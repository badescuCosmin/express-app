const http = require("http");
const app = require("./app");
const mongoose = require("mongoose");

const { loadPlanetsData } = require("./models/planets.model");

const server = http.createServer(app);

const MONGO_URL =
  "mongodb+srv://nasa-api:ne8lftj2HvYHu0ph@cluster0.oniv57g.mongodb.net/nasa?retryWrites=true&w=majority";

const PORT = process.env.PORT || 8000;

mongoose.connection.once("open", () => {
  console.log("connection is ready");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function startServer() {
  await mongoose.connect(MONGO_URL, {});
  await loadPlanetsData();
  server.listen(PORT, () => console.log(`server started at port ${PORT}`));
}

startServer();
