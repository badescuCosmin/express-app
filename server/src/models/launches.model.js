const launches = new Map();

const launch = {
  flightNumber: 100,
  mission: "Tet",
  rocket: "asdas",
  launchDate: new Date(),
  target: "sd",
  customers: ["Nasa", "Test"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
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
