const {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require("../../models/launches.model");
const { getPagination } = require("../../services/query");

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
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

  const addedLaunch = await scheduleNewLaunch(launch);
  console.log(addedLaunch, "show");

  return res.status(201).json(addedLaunch);
}

async function httpAbortLaunch(req, res) {
  const launchId = +req.params.id;
  const existLaunch = await existsLaunchWithId(launchId);
  if (!existLaunch) {
    return res.status(404).json({ error: "Not found" });
  }
  const aborted = await abortLaunchById(launchId);
  if (!aborted) {
    return res.status(400).json({ error: "Not aborted" });
  }
  return res.status(200).json({ ok: true });
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
