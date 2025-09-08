const fs = require("fs").promises;
const path = require("path");
const http = require("http");
const url = require("url");

let folder = path.join(__dirname, "../form-for-json-data/server/data");
let file = path.join(folder, "info.json");

async function readUsers() {
  try {
    let data = await fs.readFile(file, "utf-8");
    let users = JSON.parse(data); 
    // console.log("Users:", users);
    return users;
  } catch (err) {
    console.error("Error reading file:", err);
    return [];
  }
}

//readUsers();

let r ={
  "/": async () => ({
    name: "This is the home page press /user to get the users",
    description: "Access system information via routes",
    routes: ["/user"],
  }),
  "/user":readUsers,
};
//creating server
const server = http.createServer(async (req, res) => {
  const urll = url.parse(req.url);
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET") {
    if (r[urll.pathname]) {
      res.statusCode = 200;
      let data = await r[urll.pathname]();
      const response =
        typeof data === "string" ? data : JSON.stringify(data, null, 2);
      res.end(response);
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Error: page not found" }));
    }
  } else {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Error: Method not allowed" }));
  }
});

const port = 5000;
//starting the server
server.listen(port,() => {
  console.log(`Tap to open the server http://localhost:${port}`);
  console.log("Ctrl+c to shut down the server");
});
