let fs = require("fs");
let path = require("path");

let folder = path.join(__dirname, "arhum");
let file = path.join(folder, "arhums.pdf");


//first create a folder and check exitsing folder!
if (!fs.existsSync(folder) ? fs.mkdirSync(folder) : "folder already created");
//create and write into file
if (
  fs.existsSync(folder)
    ? fs.writeFileSync(file, "This is the first text in this file")
    : "first create the folder"
);

// //to append in file
 fs.appendFileSync(file, "This is second text of the file");
// //to read
 let f = fs.readFileSync(file, "utf-8")
// console.log(f);

//to delete
//fs.unlinkSync(file);
// fs.rmdirSync(folder);


