const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const sensorRoutes = require("./routes/sensorRoutes");
const deviceRoutes = require("./routes/deviceRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Thêm tất cả các routes
app.use("/api/v1/sensors", sensorRoutes);
app.use("/api/v1/devices", deviceRoutes);

app.all("*", (req, res) => {
  res.status(404).json({ message: "Route không tồn tại!" });
});

module.exports = app;
