const http = require("http")
const fs = require("fs")
const path = require("path")
const process = require("process")
const { log } = require("console")

let args = process.argv.slice(2)

let help = ()=>{
    console.log("Text file Analysis Tool");
    console.log("Usage: node file.js <file.txt> [options]");
    console.log("Options:");
    console.log("-h, --Help  show help");
    console.log("-s, --Summary show file summary(Only count lines, words, characters)");
    console.log("-d, --Details show file details");
    console.log("Example");
    console.log("node file.js sample.txt -s"); 
    console.log("node file.js sample.txt -d");
}