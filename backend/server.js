const app = require("./app");

const dotenv = require ("dotenv");


const connectDatabase= require("./config/database")
// hadling uncaught exception
process.on("uncaughtException",err=>{
    console.log(`Error: ${err.message }`);
    console.log(`Shutting Down The server due to Uncaught Exception`);
server.close(()=>{
    process.exit(1);
})
})

// config 
dotenv.config({path:"backend/config/config.env"});
//connecting to database

connectDatabase()

const server= app.listen(process.env.PORT,()=>{
    console.log(`server is working on  htttp://localhost:${process.env.PORT} `)

})
 

// unhandled Promise Rejection

process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message }`);
    console.log(`Shutting Down The server due to Unhandled Promise Rejection`);
server.close(()=>{
    process.exit(1);
})

})