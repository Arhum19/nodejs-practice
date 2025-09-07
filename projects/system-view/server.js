const os = require("os");
const url = require("url");
const http = require("http");
const process = require("process");
let decimal = 2;
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
  let model =  os.cpus()[0].model 
  let core =  os.cpus().length
  let architecture = os.arch();
  let load_Average = os.loadavg();

  console.log({
    model,core,architecture,load_Average
  });
}

//getcpu();

// memort info
let getmem = () => {
  let Total_Memory =  os.totalmem(); 
  let Remaining_Memory =  os.freemem();
  let tot = Total_Memory - Remaining_Memory;
  let usage = ((tot/Total_Memory*100).toFixed(decimal)+"%") 

  console.log({
    Total_Memory: formatBytes(Total_Memory, decimal),
    Remaining_Memory: formatBytes(Remaining_Memory, decimal),
    Usage: usage
  });
}
//getmem();

// os info
let getos = () => {
  let platform =  os.platform(); 
  let host =  os.hostname();
  let type = os.type();
  let release  = os.release();
  let up = os.uptime();

  console.log({
    platform,host,type,release,Up_Time:formatUptime(up)
  });
}
//getos();

let uinfo = () =>{
    let user = os.userInfo()
    console.log(user);
    
}
//uinfo();

let network = () =>{
    let net = os.networkInterfaces()
    console.log(net);
    
}
// network();

let processinfo = () =>{
    let pid = process.pid;
    let title = process.title;
    let nodeversion = process.version;
    let platform = process.platform;
    let cwd = process.cwd();
    let memoryUsage ={
        rss:  formatBytes(process.memoryUsage().rss, decimal),
        heapTotal: formatBytes(process.memoryUsage().heapTotal, decimal),
        heapUsed: formatBytes(process.memoryUsage().heapUsed, decimal),
        external: formatBytes(process.memoryUsage().external, decimal),  
    }
    
    console.log({
        pid,title,nodeversion,platform,cwd,memoryUsage
    });
}
processinfo();

//creating the http server for the application
