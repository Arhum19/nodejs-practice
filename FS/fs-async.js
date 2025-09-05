let fs = require("fs").promises;
const { log } = require("console");
let path = require("path");

let folder = path.join(__dirname, "prod");
let file = path.join(folder, "produciton.pdf");


//first create a folder and check exitsing folder!
async function createfolder() {
try{
    await fs.mkdir(folder, {recursive: true})
    console.log("File has been created");
    
}
catch(er){
     console.log("There's an error in it",er);

    }
}
//createfolder();

async function writef() {
try{
    await fs.writeFile(file, "This is an first text")
    
}
catch(er){
     console.log("There's an error in it",er);

    }
}
//writef();

async function del() {
try{
    await fs.unlink(file)
}
catch(er){
     console.log("There's an error in it",er);

    }
}
del();
