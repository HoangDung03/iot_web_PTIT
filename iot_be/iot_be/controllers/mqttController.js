const { saveSensorData, logDeviceAction } = require("../models/mqttModel");

async function handleSensorData(data) {
  try {
    console.log("📡 Received sensor data:", data);

    const { temperature, humidity, light } = data;

    const result = await saveSensorData({
      temperature,
      humidity,
      light,
    });

    console.log("✅ Sensor data saved. ID:", result.insertId);
  } catch (error) {
    console.error("❌ Error saving sensor data:", error);
  }
}

async function handleDeviceData(data) {
  try {
    console.log("📥 Received device data:", data);

    const { device_name, action } = data;

    const result = await logDeviceAction({ device_name, action });

    console.log(
      `✅ Device '${device_name}' action '${action}' logged. ID: ${result.insertId}`
    );
  } catch (error) {
    console.error("❌ Error saving device data:", error);
  }
}

module.exports = {
  handleSensorData,
  handleDeviceData,
};
