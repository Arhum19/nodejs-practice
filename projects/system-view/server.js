const os = require("os");
const url = require("url");
const http = require("http");
const process = require("process");
let decimal = 2;
//format bytes into readable format
function formatBytes(bytes, decimal) {
  if (bytes === 0) return 0;
  const k = 1024;
  const sizes = ["bytes", "kb", "mb", " gb", "tb", "pb"];
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
function getcpu() {
  let model =  os.cpus()[0].model 
  let core =  os.cpus().length
  let architecture = os.arch();
  let load_Average = os.loadavg();

  console.log({
    model,core,architecture,load_Average
  });
}
getcpu();
