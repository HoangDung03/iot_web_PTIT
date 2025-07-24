const Sensor = require("../models/sensorModel");

exports.getLatest = async (req, res) => {
  try {
    const sensors = await Sensor.getLatest();
    res.status(200).json({
      status: "success",
      message: "Lấy dữ liệu cảm biến mới nhất thành công",
      results: sensors.length,
      data: sensors,
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.getSensorData = async (req, res) => {
  try {
    const { page, limit, type, dir, keyword } = req.query;
    let sensors;

    if (!page && !limit && !type && !dir && !keyword) {
      sensors = await Sensor.getAllSorted();
    } else {
      sensors = await Sensor.getSensorData({ page, limit, type, dir, keyword });
    }

    res.status(200).json({
      status: "success",
      message: "Lấy dữ liệu cảm biến thành công",
      results: sensors.length,
      data: sensors,
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.getRecentData = async (req, res) => {
  try {
    const sensors = await Sensor.getRecentData(10); // Lấy 10 bản ghi mới nhất
    res.status(200).json({
      status: "success",
      message: "Lấy 10 bản ghi cảm biến mới nhất thành công",
      results: sensors.length,
      data: sensors,
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

module.exports = exports;
