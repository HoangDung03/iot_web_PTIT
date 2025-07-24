// models/deviceModel.js
const pool = require("../db/db");

class Device {
  static async updateDeviceStatus(device_name, status) {
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

    // Ghi vào lịch sử thiết bị
    const [result] = await pool.query(
      "INSERT INTO device_history (device_name, action, timestamp) VALUES (?, ?, ?)",
      [device_name, status, timestamp]
    );

    return result.insertId;
  }

  static async getDeviceData({ timestamp, dir = "asc" }) {
    let query = `
      SELECT 
        id, 
        device_name, 
        action, 
        DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:%s') AS timestamp
      FROM device_history
    `;
    const params = [];

    if (timestamp) {
      query += " WHERE timestamp LIKE ?";
      params.push(`${timestamp}%`);
    }

    query += ` ORDER BY timestamp ${dir.toUpperCase()}`;

    const [rows] = await pool.query(query, params);
    return rows;
  }
  static async getLatestDeviceStates() {
    const query = `
    SELECT d.device_name, d.action
    FROM device_history d
    JOIN (
      SELECT device_name, MAX(id) AS max_id
      FROM device_history
      GROUP BY device_name
    ) latest ON d.device_name = latest.device_name AND d.id = latest.max_id;
  `;

    const [rows] = await pool.query(query);

    // Định dạng dữ liệu về dạng object { led_1: 'on', ... }
    const state = {};
    rows.forEach((row) => {
      state[row.device_name] = row.action;
    });

    return state;
  }
}

module.exports = Device;
