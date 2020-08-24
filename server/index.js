const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const open = require("open");
const ver = require("../package.json").version;
const appName = require("../package.json").name;

const settingsCtrl = require("./settingsCtrl");
const geolocationCtrl = require("./geolocationCtrl");

const {
  getSettings,
  setSetting,
  deleteSetting,
  createSettingsFile,
  replaceSettings,
} = settingsCtrl;
const { getCoords } = geolocationCtrl;

const DIST_DIR = "/../client/dist";
const PORT = 8080;
const app = express();

// ***** dev only:
// const livereload = require("livereload");
// const connectLivereload = require("connect-livereload");
// const liveReloadServer = livereload.createServer();
// liveReloadServer.watch(path.join(`${__dirname}/${DIST_DIR}`));
// liveReloadServer.server.once("connection", () => {
//   setTimeout(() => {
//     liveReloadServer.refresh("/");
//   }, 100);
// });
// app.use(connectLivereload());
// *****

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(`${__dirname}/${DIST_DIR}`)));
app.listen(PORT, "localhost", async () => {
  await open(`http://localhost:${PORT}`);
  console.log(`${appName} v${ver} has started on port ${PORT}`);
});

app.get("/settings", getSettings);
app.post("/settings", createSettingsFile);
app.put("/settings", replaceSettings);
app.patch("/setting", setSetting);
app.delete("/setting", deleteSetting);

app.get("/geolocation", getCoords);
