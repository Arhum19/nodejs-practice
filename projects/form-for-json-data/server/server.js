// server/server.js
const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const app = express();
app.use(express.json());

let folder = path.join(__dirname, "data");
let file = path.join(folder, "info.json");

// ensure folder exists
(async () => {
  await fs.mkdir(folder, { recursive: true });
})();

// API to save (append) user
app.post("/save", async (req, res) => {
  try {
    let newUser = req.body;

    let users = [];
    try {
      let data = await fs.readFile(file, "utf-8");
      users = JSON.parse(data); // existing users
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
    }

    users.push(newUser); // add new user

    await fs.writeFile(file, JSON.stringify(users, null, 2));

    res.json({ message: "User saved successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save user" });
  }
});

// API to fetch all users
app.get("/users", async (req, res) => {
  try {
    let data = await fs.readFile(file, "utf-8");
    let users = JSON.parse(data);
    res.json(users);
  } catch (err) {
    res.json([]); // empty array if no file
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
