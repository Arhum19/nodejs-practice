console.log("Hello my fisrt node js code!!")
let hours = new Date().getHours
let name  = "arhum";
let greting = (hours < 12 ? "Good Morning" : hours < 16 ? "Good Afternoon" : "Good Evening");
console.log(`Hi ${name}, ${greting} this is our first node js code!`);

