const fs = require("fs");
const path = require("path");

const jsonFilePath = path.join(__dirname, "data.json");

const db = {
  loadData: () => {
    try {
      const data = fs.readFileSync(jsonFilePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  },
  saveData: (data) => {
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), "utf8");
  },
};

module.exports = db;
