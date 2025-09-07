const os = require("os");
const url = require("url");
const http = require("http");
const process = require("process");
let decimal = 2;
let fs = require("fs").promises;
let path = require("path");
let folder = path.join(__dirname, "user");
let file = path.join(folder, "users.json");


//format bytes into readable format
function formatBytes(bytes, decimal) {
  if (bytes === 0) return 0;
  const k = 1024;
  const sizes = ["bytes", "KB", "MB", "GB", "TB", "PB"];
  let i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimal)) + " " + sizes[i];
}

//format uptime into days, hours, minutes and seconds
function formatUptime(seconds) {
  let uptime = "";
  const days = Math.floor(seconds / (3600 * 24));
  seconds %= 3600 * 24;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);
  return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}

// get cpu info
let getcpu = () => {
  let model = os.cpus()[0].model;
  let core = os.cpus().length;
  let architecture = os.arch();
  let load_Average = os.loadavg();

  return {
    model,
    core,
    architecture,
    load_Average,
  };
};

//getcpu();

// memort info
let getmem = () => {
  let Total_Memory = os.totalmem();
  let Remaining_Memory = os.freemem();
  let tot = Total_Memory - Remaining_Memory;
  let usage = ((tot / Total_Memory) * 100).toFixed(decimal) + "%";

  return {
    Total_Memory,
    Remaining_Memory: formatBytes(Remaining_Memory, decimal),
    usage: usage
  }
};
//getmem();

// os info
let getos = () => {
  let platform = os.platform();
  let host = os.hostname();
  let type = os.type();
  let release = os.release();
  let up = os.uptime();

  return{
    platform,
    host,
    type,
    release,
    Up_Time: formatUptime(up),
  }
    
};
//getos();

let uinfo = () => {
  let user = os.userInfo();
  return{
    user,
  }
};
//uinfo();

let network = () => {
  let net = os.networkInterfaces();
  return{
    net,
  }
};
// network();

let processinfo = () => {
  let pid = process.pid;
  let title = process.title;
  let nodeversion = process.version;
  let platform = process.platform;
  let cwd = process.cwd();
  let memoryUsage = {
    rss: formatBytes(process.memoryUsage().rss, decimal),
    heapTotal: formatBytes(process.memoryUsage().heapTotal, decimal),
    heapUsed: formatBytes(process.memoryUsage().heapUsed, decimal),
    external: formatBytes(process.memoryUsage().external, decimal),
  };
  let node = process.env.NODE_ENV || "server not set";

  return{
    pid,
    title,
    nodeversion,
    platform,
    cwd,
    memoryUsage,
    node,
  }
    
};
//processinfo();

let r = {
  "/": () => ({
    name: "Simple JSON server!!",
    description: "Access system information via routes",
    routes: ["/memory", "/cpu", "/os", "/user", "/process", "/network"],
  }),
  "/memory": getmem,
  "/cpu": getcpu,
  "/os": getos,
  "/network": network,
  "/user": uinfo,
  "/process": processinfo,
};

const server = http.createServer((req, res) => {
  const urll = url.parse(req.url);

  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET") {
    if (r[urll.pathname]) {
      res.statusCode = 200;

      // run the function at request time
      let data = r[urll.pathname]();
      const response =
        typeof data === "string" ? data : JSON.stringify(data, null, 2);

      //res.end(data ? response : JSON.stringify(r["/"](), null, 2));
      res.end(response)  
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Error page not found" }));
    }
  } else {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Method not allowed!" }));
  }
});

//start the server
const port = 5000;
server.listen(port, () => {
  console.log(`Tap to open the server: http://localhost:${port}`);
  console.log("Press ctrl+c to end the server");
});

// create folder and file to store user data
async function createfolder() {
  try {
    await fs.mkdir(folder, { recursive: true });
    console.log("Folder has been created");
  } catch (er) {
    console.log("There's an error in it", er);
  }
}
createfolder();
//createfile
async function writef() {
  try {
    let data = uinfo();
    await fs.writeFile(file, JSON.stringify(data, null, 2));
    console.log("File has been created");
  } catch (er) {
    console.log("There's an error in it", er);
  }
}
writef();
