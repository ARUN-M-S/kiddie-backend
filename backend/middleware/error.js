const ErrorHandler = require("../utils/errorhandler")


module.exports=(err,req,res,next)=>{
    err.statusCode = err.statusCode || 500 ;
    err.message = err.message || "Internal Server Error";

// wrong mongodb Id error
 if(err.name === "CastError") {
     const message = `Resource not Found. Invalid:${err.path}`;
     err = new ErrorHandler(message,400 );
 }
 // mongoose duplicate key error

if(err.code === 11000 ){
    const message = `Duplicate ${Object.keys(err.keyValue)} enterd`;
    err = new ErrorHandler(message,400 );

}
// wrong jwt error
if(err.name === "JsonWebTokenError") {
    const message = `JsonWebToken is  Invalid`;
    err = new ErrorHandler(message,400 );
}
//  jwt expire error
if(err.name === "TokenExpiredError") {
    const message = `JsonWebToken is  Expired,Try again`;
    err = new ErrorHandler(message,400 );
}


    res.status(err.statusCode).json({
        success : false,
        message:err.message,
    });

}; 
