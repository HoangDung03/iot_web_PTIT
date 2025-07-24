const pool = require("../db/db");

class Sensor {
  static async getLatest() {
    const [rows] = await pool.query(
      "SELECT id, temperature, humidity, light, DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:%s') AS timestamp FROM sensor_data ORDER BY timestamp DESC LIMIT 1"
    );
    return rows;
  }

  static async getAllSorted() {
    const [rows] = await pool.query(
      "SELECT id, temperature, humidity, light,  DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:%s') AS timestamp FROM sensor_data ORDER BY id ASC"
    );
    return rows;
  }

  static async getSensorData({
    page = 1,
    limit = 10,
    type,
    dir = "asc",
    keyword,
  }) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        id, 
        temperature, 
        humidity, 
        light, 
        DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:%s') AS timestamp 
      FROM sensor_data
    `;
    let params = [];
    const conditions = [];

    if (keyword) {
      if (type && ["temperature", "humidity", "light"].includes(type)) {
        conditions.push(
          `CAST(${type} AS DECIMAL(10,2)) = CAST(? AS DECIMAL(10,2))`
        );
        params.push(parseFloat(keyword));
      } else if (type === "timestamp") {
        conditions.push("timestamp LIKE ?");
        params.push(`${keyword}%`);
      } else {
        conditions.push(
          "(CAST(temperature AS CHAR) LIKE ? OR CAST(humidity AS CHAR) LIKE ? OR CAST(light AS CHAR) LIKE ? OR timestamp LIKE ?)"
        );
        params.push(
          `%${keyword}%`,
          `%${keyword}%`,
          `%${keyword}%`,
          `%${keyword}%`
        );
      }
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += ` ORDER BY timestamp ${
      dir === "asc" ? "ASC" : "DESC"
    } LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async getRecentData(limit = 10) {
    const [rows] = await pool.query(
      `SELECT id, temperature, humidity, light,DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:%s') AS timestamp 
       FROM sensor_data 
       ORDER BY timestamp DESC 
       LIMIT ?`,
      [limit]
    );
    return rows;
  }
}

module.exports = Sensor;
