const mongoose=require("mongoose");



const connectDatabase = ()=>{
    mongoose.connect(process.env.DB_URI,{ useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true}).then((data)=>{
        console.log(`Mongodb is connected with Server: ${data.connection.host}`);
     })}
     // we handled the err as Uncatched promise error in the server
     //.catch((err)=>{
    //         console.log(err);
    //      })}


module.exports=connectDatabase