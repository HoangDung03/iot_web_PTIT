const pool = require("../db/db");

// Lưu dữ liệu cảm biến vào bảng sensor_data
const saveSensorData = async ({ temperature, humidity, light }) => {
  const [result] = await pool.query(
    "INSERT INTO sensor_data (temperature, humidity, light) VALUES (?, ?, ?)",
    [temperature, humidity, light]
  );

  return result;
};

const logDeviceAction = async ({ device_name, action }) => {
  const [result] = await pool.query(
    "INSERT INTO device_history (device_name, action) VALUES (?, ?)",
    [device_name, action]
  );

  return result;
};

module.exports = {
  saveSensorData,
  logDeviceAction,
};
