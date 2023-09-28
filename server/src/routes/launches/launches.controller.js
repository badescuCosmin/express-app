const {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require("../../models/launches.model");

async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches());
}

function httpAddNewLaunch(req, res) {
  const launch = req.body;
  if (
    !launch.launchDate ||
    !launch.mission ||
    !launch.rocket ||
    !launch.target
  ) {
    return res.status(400).json({ error: "Missing required launch prop" });
  }
  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({ error: "Invalid date" });
  }

  const addedLaunch = addNewLaunch(launch);

  return res.status(201).json(addedLaunch);
}

function httpAbortLaunch(req, res) {
  const launchId = +req.params.id;
  if (!existsLaunchWithId(launchId)) {
    res.status(404).json({ error: "Not found" });
  }
  const aborted = abortLaunchById(launchId);
  return res.status(200).json(aborted);
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
