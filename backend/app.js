const express= require("express");
const app=express();
const errorMiddleware = require("./middleware/error")
const cookieParser= require("cookie-parser")


app.use(express.json ());
app.use(cookieParser())
//routes import
const product = require("./routes/ProductRoute");
const user = require("./routes/userRoute")
app.use("/api/v1",product);
app.use("/api/v1",user);


// error Middleware 

app.use(errorMiddleware)

module.exports = app