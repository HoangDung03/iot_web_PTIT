const express = require("express");
const sensorController = require("../controllers/sensorController");

const router = express.Router();

router.get("/latest", sensorController.getLatest);
router.get("/data", sensorController.getSensorData);
router.get("/recent", sensorController.getRecentData);
module.exports = router;
