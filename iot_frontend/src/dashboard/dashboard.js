// Thêm thư viện MQTT
const mqttScript = document.createElement("script");
mqttScript.src = "https://unpkg.com/mqtt@5.3.4/dist/mqtt.min.js";
document.head.appendChild(mqttScript);

const switchStates = {
  led_1: false,
  led_2: false,
  led_3: false,
};

// Kết nối MQTT
let mqttClient;
mqttScript.onload = () => {
  const clientId = "web_client_" + Math.random().toString(16).slice(3);
  mqttClient = mqtt.connect("ws://192.168.43.160", {
    clientId: clientId,
    username: "hoang1",
    password: "123456",
    clean: true,
  });

  mqttClient.on("connect", () => {
    console.log("✅ Kết nối MQTT thành công");
    mqttClient.subscribe("device/response", (err) => {
      if (err) {
        console.error("❌ Lỗi khi subscribe device/response:", err);
      } else {
        console.log("✅ Đã subscribe topic device/response");
      }
    });
  });

  mqttClient.on("message", (topic, message) => {
    if (topic === "device/response") {
      try {
        const data = JSON.parse(message.toString());
        console.log("📩 Nhận phản hồi từ device/response:", data);
        const { device_name, action } = data;
        const isOn = action === "1" || action === "on";

        if (["led_1", "led_2", "led_3"].includes(device_name)) {
          switchStates[device_name] = isOn;
          const switchId =
            device_name === "led_1"
              ? "tempSwitch"
              : device_name === "led_2"
              ? "humiditySwitch"
              : "lightSwitch";
          const switchElement = document.getElementById(switchId);

          //
          switchElement.checked = isOn;
          switchElement.disabled = false;
          showPopup(
            `${device_name} đã được ${isOn ? "bật" : "tắt"} thành công`,
            "success"
          );

          switchElement.addEventListener("change", switchElement._listener);
        }
      } catch (err) {
        console.error("❌ Lỗi khi xử lý phản hồi MQTT:", err);
      }
    }
  });

  mqttClient.on("error", (err) => {
    console.error("❌ Lỗi MQTT:", err);
  });
};

const metrics = [
  {
    id: "temperature",
    icon: "bi-thermometer-half",
    label: "Nhiệt độ",
    unit: "°C",
    value: 30,
    class: "temperature",
    threshold: 20,
  },
  {
    id: "humidity",
    icon: "bi-droplet",
    label: "Độ ẩm",
    unit: "%",
    value: 60,
    class: "humidity",
    threshold: 30,
  },
  {
    id: "light",
    icon: "bi-brightness-high",
    label: "Ánh sáng",
    unit: "lux",
    value: 800,
    class: "light",
    threshold: 40,
  },
];

const container = document.getElementById("metrics-container");

metrics.forEach((metric) => {
  const col = document.createElement("div");
  col.className = "col-md-4";

  col.innerHTML = `
      <div class="metric-card ${metric.class}" id="${metric.id}-card">
        <i class="bi ${metric.icon} mb-2"></i>
        <div>${metric.label}</div>
        <div id="${metric.id}">${metric.value}${metric.unit}</div>
      </div>
    `;

  container.appendChild(col);
});

// hiệu ứng nháy đỏ
const style = document.createElement("style");
style.textContent = `
  @keyframes alert-flash {
    0%, 100% { background: linear-gradient(135deg, #ff4d4d 0%, #cc0000 100%); }
    50% { background: linear-gradient(135deg, #ff9999 0%, #ff3333 100%); }
  }
  
  .alert-threshold {
    animation: alert-flash 1s infinite;
  }
`;
document.head.appendChild(style);

// Biểu đồ nhiệt độ
const tempCtx = document.getElementById("tempChart").getContext("2d");
const tempChart = new Chart(tempCtx, {
  type: "line",
  data: {
    labels: ["00:00", "01:00", "02:00", "03:00", "04:00"],
    datasets: [
      {
        label: "Nhiệt độ",
        data: [30, 32, 31, 29, 28],
        borderColor: "#FF9966",
        backgroundColor: "rgba(255, 153, 102, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      title: {
        display: true,
        text: "Nhiệt độ",
        color: "#212529",
        font: {
          size: 16,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  },
});

// Biểu đồ độ ẩm
const humidityCtx = document.getElementById("humidityChart").getContext("2d");
const humidityChart = new Chart(humidityCtx, {
  type: "line",
  data: {
    labels: ["00:00", "01:00", "02:00", "03:00", "04:00"],
    datasets: [
      {
        label: "Độ ẩm",
        data: [60, 58, 57, 59, 61],
        borderColor: "#33CCFF",
        backgroundColor: "rgba(51, 204, 255, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      title: {
        display: true,
        text: "Độ ẩm",
        color: "#212529",
        font: {
          size: 16,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  },
});

// Biểu đồ ánh sáng
const lightCtx = document.getElementById("lightChart").getContext("2d");
const lightChart = new Chart(lightCtx, {
  type: "line",
  data: {
    labels: ["00:00", "01:00", "02:00", "03:00", "04:00"],
    datasets: [
      {
        label: "Ánh sáng",
        data: [800, 820, 810, 780, 790],
        borderColor: "#FFCC00",
        backgroundColor: "rgba(255, 204, 0, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      title: {
        display: true,
        text: "Ánh Sáng",
        color: "#212529",
        font: {
          size: 16,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  },
});

// Lấy dữ liệu cảm biến mới nhất
function fetchLatestMetrics() {
  fetch("http://localhost:5000/api/v1/sensors/latest")
    .then((res) => res.json())
    .then((resData) => {
      if (resData.status === "success" && resData.data.length > 0) {
        const latest = resData.data[0];

        // Cập nhật giá trị
        document.getElementById("temperature").textContent =
          latest.temperature + "°C";
        document.getElementById("humidity").textContent = latest.humidity + "%";
        document.getElementById("light").textContent = latest.light + "lux";

        // nháy
        const temperatureCard = document.getElementById("temperature-card");
        if (latest.temperature > 20) {
          temperatureCard.classList.add("alert-threshold");
        } else {
          temperatureCard.classList.remove("alert-threshold");
          temperatureCard.style.background =
            "linear-gradient(135deg, #ff9966 0%, #ff9966 100%)";
        }

        const humidityCard = document.getElementById("humidity-card");
        if (latest.humidity > 30) {
          humidityCard.classList.add("alert-threshold");
        } else {
          humidityCard.classList.remove("alert-threshold");
          humidityCard.style.background =
            "linear-gradient(135deg, #33ccff 0%, #33ccff 100%)";
        }

        const lightCard = document.getElementById("light-card");
        if (latest.light > 40) {
          lightCard.classList.add("alert-threshold");
        } else {
          lightCard.classList.remove("alert-threshold");
          lightCard.style.background =
            "linear-gradient(135deg, #ffcc00 0%, #ffcc00 100%)";
        }
      }
    })
    .catch((err) => {
      console.error("❌ Lỗi khi fetch dữ liệu cảm biến:", err);
    });
}

function fetchRecentChartData() {
  fetch("http://localhost:5000/api/v1/sensors/recent")
    .then((res) => res.json())
    .then((resData) => {
      if (resData.status === "success" && resData.data.length > 0) {
        const recentData = resData.data.reverse();

        const labels = recentData.map((item) => item.timestamp.slice(11, 16));
        const temperatureData = recentData.map((item) => item.temperature);
        const humidityData = recentData.map((item) => item.humidity);
        const lightData = recentData.map((item) => item.light);

        tempChart.data.labels = labels;
        tempChart.data.datasets[0].data = temperatureData;
        tempChart.update();

        humidityChart.data.labels = labels;
        humidityChart.data.datasets[0].data = humidityData;
        humidityChart.update();

        lightChart.data.labels = labels;
        lightChart.data.datasets[0].data = lightData;
        lightChart.update();
      }
    })
    .catch((err) => {
      console.error("❌ Lỗi khi fetch dữ liệu biểu đồ:", err);
    });
}

function showPopup(message, type = "success") {
  const popup = document.createElement("div");
  popup.textContent = message;
  popup.className = `popup-message ${type}`;
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.classList.add("show");
  }, 100);

  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 300);
  }, 3000);
}

function handleSwitchChange(deviceName, switchId) {
  const switchElement = document.getElementById(switchId);
  const currentState = switchElement.checked;

  switchElement.disabled = true;

  toggleDevice(deviceName, currentState, switchElement);
}

function toggleDevice(deviceName, isOn, switchElement) {
  console.log(`📤 Gửi lệnh: ${deviceName} -> ${isOn ? "on" : "off"}`);
  const loadingPopup = document.getElementById("loadingPopup");
  const loadingMessage = document.getElementById("loadingMessage");

  loadingMessage.textContent = `Đang ${isOn ? "bật" : "tắt"} ${deviceName}...`;
  loadingPopup.classList.add("show");

  const timeout = setTimeout(() => {
    loadingMessage.textContent = "❌ Không nhận được phản hồi từ thiết bị!";
    switchElement.disabled = false;
    loadingPopup.classList.remove("show");
    showPopup(`Không nhận được phản hồi từ ${deviceName}`, "error");
  }, 10000); // 10 giây

  setTimeout(() => {
    fetch("http://localhost:5000/api/v1/devices/toggle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        device_name: deviceName,
        action: isOn ? "on" : "off",
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        console.log("📥 Phản hồi từ API:", resData);
        clearTimeout(timeout);
        if (resData.status === "success") {
          loadingMessage.textContent = "✅ Thao tác thành công!";
          showPopup(`${deviceName} đã được ${isOn ? "bật" : "tắt"}`, "success");
        } else {
          loadingMessage.textContent = "❌ Thao tác không thành công!";
          showPopup(`Lỗi: ${resData.message}`, "error");
        }
        switchElement.disabled = false;
        loadingPopup.classList.remove("show");
      })
      .catch((err) => {
        console.error("❌ Lỗi khi gọi API:", err);
        clearTimeout(timeout);
        loadingMessage.textContent = "❌ Lỗi kết nối đến máy chủ!";
        switchElement.disabled = false;
        loadingPopup.classList.remove("show");
        showPopup("Lỗi kết nối đến máy chủ", "error");
      });
  }, 2000);
}

function handleSwitchChange(deviceName, switchId) {
  const switchElement = document.getElementById(switchId);
  const currentState = switchElement.checked;

  localStorage.setItem(deviceName, currentState ? "on" : "off");

  switchElement.disabled = true;

  toggleDevice(deviceName, currentState, switchElement);
}

const tempSwitch = document.getElementById("tempSwitch");
tempSwitch._listener = () => handleSwitchChange("led_1", "tempSwitch");
tempSwitch.addEventListener("change", tempSwitch._listener);

const humiditySwitch = document.getElementById("humiditySwitch");
humiditySwitch._listener = () => handleSwitchChange("led_2", "humiditySwitch");
humiditySwitch.addEventListener("change", humiditySwitch._listener);

const lightSwitch = document.getElementById("lightSwitch");
lightSwitch._listener = () => handleSwitchChange("led_3", "lightSwitch");
lightSwitch.addEventListener("change", lightSwitch._listener);

fetch("http://localhost:5000/api/v1/devices/latest-state")
  .then((res) => res.json())
  .then((resData) => {
    if (resData.status === "success") {
      const states = resData.data;

      // Cập nhật trạng thái công tắc
      const led1State = localStorage.getItem("led_1");
      const led2State = localStorage.getItem("led_2");
      const led3State = localStorage.getItem("led_3");
      document.getElementById("tempSwitch").checked =
        led1State === "on" || states["led_1"] === "on";
      document.getElementById("humiditySwitch").checked =
        led2State === "on" || states["led_2"] === "on";
      document.getElementById("lightSwitch").checked =
        led3State === "on" || states["led_3"] === "on";
    }
  })
  .catch((err) => {
    console.error("❌ Lỗi khi fetch trạng thái thiết bị:", err);
  });

fetchLatestMetrics();
fetchRecentChartData();

// Cập nhật mỗi 1 giây
setInterval(() => {
  fetchLatestMetrics();
  fetchRecentChartData();
}, 1000);
