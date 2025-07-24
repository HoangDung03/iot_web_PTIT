const express = require("express");
const deviceController = require("../controllers/deviceController");

const router = express.Router();

router.route("/data").get(deviceController.getDeviceData);
router.route("/toggle").post(deviceController.toggleDevice);
router.route("/latest-state").get(deviceController.getLatestDeviceStates);

module.exports = router;
