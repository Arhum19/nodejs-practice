const server = require(`http`)

let s =  server.createServer((req,res)=>{
    console.log(`Recieved ${req.method} and the type is ${req.url}`);
    //set status code and headers
    res.writeHead(200,{"content-type": "text/plain"})
    //get the response
    res.end("Hello from the server")
    
});

const port = 5000;

s.listen(port,()=>{
    console.log(`Tap to open the server: http://localhost:${port}`);
    console.log("Press ctrl+c to end the server");
    
    
})