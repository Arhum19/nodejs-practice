const http = require("http");
let r = {
  "/": "Welcome to the home page!!",
  "/users": [{ name: "John Doe", age: 30, occupation: "Developer"},{name: "arhum noor", age: 40, occupation: "Developer"}],
  "/products": [{name: "mobile", price:2092, company:"iphone"}],
};

let s = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.method === "GET") {
    if (r[req.url]) {
      res.statusCode = 200;
      const response = typeof r[req.url] === "string" ? r[req.url] : JSON.stringify(r[req.url]);
      res.end(response);
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Page not found!!" }));
    }
  } else {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Method not allowed!" }));
  }
});

const port = 5000;

s.listen(port, () => {
  console.log(`Tap to open the server: http://localhost:${port}`);
  console.log("Press ctrl+c to end the server");
});
