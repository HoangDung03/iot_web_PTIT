// mqttClient.js
const mqtt = require("mqtt");
const dotenv = require("dotenv");
const {
  handleSensorData,
  handleDeviceData,
} = require("../controllers/mqttController");

dotenv.config({ path: "./config.env" });

// Tạo URL kết nối
const url = `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`;

const mqttOptions = {
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASSWORD,
  clientId: "iot_client_" + Math.random().toString(16).substr(2, 8),
};

// Kết nối tới MQTT Broker
const client = mqtt.connect(url, mqttOptions);

client.on("connect", () => {
  console.log("Kết nối đến MQTT thành công");

  client.subscribe(["data/sensor", "device/response"], (err) => {
    if (err) {
      console.error("Failed to subscribe:", err);
    } else {
      console.log("Đã subscribe vào các topic: data/sensor, device/response");
    }
  });
});

client.on("error", (err) => {
  console.error("❌ Lỗi MQTT:", err);
});

client.on("message", async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    switch (topic) {
      case "data/sensor":
        await handleSensorData(data);
        break;

      case "device/response":
        await handleDeviceData(data);
        break;

      default:
        console.log("Unknown topic:", topic);
    }
  } catch (err) {
    console.error("Error parsing message:", err.message);
  }
});

module.exports = client;
