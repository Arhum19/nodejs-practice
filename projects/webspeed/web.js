const http = require("http");

function ping(url) {
  const hostname = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const starttime = Date.now();
  const req = http.get(`http://${hostname}`, (res) => {
    const duration = Date.now() - starttime;
    const code = res.statusCode;
    console.log(
      `Response received from ${hostname}\n Response Status: ${code} \nTime: ${duration}ms\n`
    );
    res.resume();
  });
  req.on("error", (err) => {
    console.error(`Failed to connect ${hostname}: ${err.message}`);
  });
  req.setTimeout(5000, () => {
    console.error(`Request to ${hostname} timed out`);
    req.abort();
  });
}

if(process.argv.length < 3){
    console.log("Error(Use this method): node web chatgpt.com google.com");
}else{
    const web =process.argv.slice(2)
    web.forEach((a)=>{
        ping(a);
    })
}