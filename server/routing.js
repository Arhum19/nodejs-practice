const http = require("http");
let r = {
  "/": "Welcome to the home page!!",
  "/about": "Welcome to the about page!!",
  "/contact": "Welcome to the contact page!!",
};

let s = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/plain");
  if (req.method === "GET") {
    if (r[req.url]) {
      res.statusCode = 200;
      res.end(r[req.url]);
    } else {
      res.statusCode = 404;
      res.end("Page not found!!");
    }
  } else {
    res.statusCode = 405;
    res.end("module not found!");
  }
});

const port = 5000;

s.listen(port, () => {
  console.log(`Tap to open the server: http://localhost:${port}`);
  console.log("Press ctrl+c to end the server");
});
