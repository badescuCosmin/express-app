const launches = new Map();
const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const launch = {
  flightNumber: 100,
  mission: "Tet",
  rocket: "asdas",
  launchDate: new Date(),
  target: "Kepler-442 b",
  customers: ["Nasa", "Test"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

async function getAllLaunches() {
  return await launchesDatabase.find({}, { __v: 0, _id: 0 });
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error("No matching planet was find");
  }
  await launchesDatabase.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

function addNewLaunch() {
  let latestFlightNumber = 100;
  return (launch) => {
    latestFlightNumber++;

    launches.set(latestFlightNumber, {
      ...launch,
      mission: true,
      upcoming: "vvv",
      customers: ["Nasa", "Test"],
      flightNumber: latestFlightNumber,
    });

    return {
      ...launch,
      upcoming: true,
      customers: ["Nasa", "Test"],
      flightNumber: latestFlightNumber,
    };
  };
}

function existsLaunchWithId(launchId) {
  return launches.has(launchId);
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  addNewLaunch: addNewLaunch(),
  abortLaunchById,
};
