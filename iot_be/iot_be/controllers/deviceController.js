// controllers/deviceController.js
const Device = require("../models/deviceModel");
const mqttClient = require("../db/mqttClient");

exports.toggleDevice = async (req, res) => {
  try {
    const { device_name, action } = req.body;

    const normalized = action.toLowerCase();
    if (!["on", "off"].includes(normalized)) {
      return res.status(400).json({
        status: "fail",
        message: "Action must be either 'on' or 'off'",
      });
    }

    const history_id = await Device.updateDeviceStatus(device_name, normalized);
    const numericStatus = normalized === "on" ? 1 : 0;
    const payload = JSON.stringify({ [device_name]: numericStatus });

    mqttClient.publish("device/control", payload, (err) => {
      if (err) {
        console.error("❌ MQTT publish error:", err);
      } else {
        console.log("📤 Published to device/control:", payload);
      }
    });

    // Phản hồi thành công
    res.status(201).json({
      status: "success",
      message: `Device '${device_name}' has been turned ${normalized}`,
      data: {
        device_name,
        action: normalized,
        timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
      },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.getDeviceData = async (req, res) => {
  try {
    const { page, limit, timestamp, dir = "asc" } = req.query;

    const devices = await Device.getDeviceData({ page, limit, timestamp, dir });

    res.status(200).json({
      status: "success",
      message: "Device data retrieved successfully",
      results: devices.length,
      data: devices,
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.getLatestDeviceStates = async (req, res) => {
  try {
    const state = await Device.getLatestDeviceStates();

    res.status(200).json({
      status: "success",
      message: "Lấy trạng thái thiết bị thành công",
      data: state,
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};
