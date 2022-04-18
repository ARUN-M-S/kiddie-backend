const User = require("../models/userModels");
const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto"); 
const { send } = require("process");

// Register User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is a sample id",
      url: "profilepicUrl",
    },
  });
  sendToken(user, 201, res);
});

//Log in user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  // checking if user given both email and password
  if (!email || !password) {
    return next(new ErrorHander("Please Enter the Email and Password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHander("Invalid Email or Password ", 401));
  }
  const isPasswordMAtched = await user.comparePassword(password);

  if (!isPasswordMAtched) {
    return next(new ErrorHander("Invalid Email or Password ", 401));
  }
  sendToken(user, 200, res);
});

//logout user

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Successfully Logged Out",
  });
});

// Forgot password

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHander(" User not Found", 404));
  }
  // Get reset Password Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforesave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `your Password Reset Token is  :- \n\n ${resetPasswordUrl} \n\n If you have not Requested for this email then Please Ignore  it`;
  try {

    await sendEmail({
      email:user.email,
      subject:`Kiddie password Recovery `,
      message, 

    })

    res.status(200).json({
      success:true,
      message:`Email Sent to  ${user.email} Successfully`
    })
    
  } catch (error) {
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined; 
  await user.save({ validateBeforesave: false });

  return next(new ErrorHander(error.message,500));

    
  }

});
// Reset Password
exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{

  //creating hash token

  const resetPasswordToken = crypto
    .createHash("SHA256")
    .update(req.params.token )
    .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire:{$gt:Date.now()}, 
    })
    if (!user) {
      return next(new ErrorHander("Reset password Token is invalid or has been expired", 400));
    }
 if(req.body.password!==req.body.confirmPassword){
  return next(new ErrorHander("Password doesn't match", 400));

 }
user.password =req.body.password;
user.resetPasswordToken=undefined;
user.resetPasswordExpire=undefined; 
await user.save(); 
sendToken(user,200,res );

});
//get user details

exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
  const user = await User.findById(req.user.id);
  if(!user){
    return next(new ErrorHander("user not found" , 404));

  }
  res.status(200).json({
    success: true,
    user,
  });
})


//update User Password

exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{
  const user = await User.findById(req.user.id).select("+password");


  const isPasswordMAtched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMAtched) {
    return next(new ErrorHander("Old password is incorrect ", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword){
    return next(new ErrorHander("Password does not match  ", 400));
  }
user.password = req.body.newPassword;
await user.save();

  sendToken(user,200,res)
})

// //update User Profile

// exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{
  

  

//   sendToken(user,200,res)
// })

// ----------------------Get all users(Admin)------------------

exports.getAllUsers= catchAsyncErrors(async(req,res,next)=>{
  const users = await User.find();
  if(!users){
    return next(new ErrorHander("No users Found", 400));
  }
  res.status(200).json({
    success: true,
    users,
  });


});

// ----------------------Get user details(Admin)------------------

exports.getSingleuserDetails = catchAsyncErrors(async(req,res,next)=>{
  const user = await User.findById(req.params.id);
  if(!user){
    return next(new ErrorHander(`user not exist with id : ${req.params.id}`, 404));

  }
  res.status(200).json({
    success: true,
    user,
  });
});

//--------------------- update user role(Admin)--------------

exports.updaterole = catchAsyncErrors(async(req,res,next)=>{
  const newUserData ={
    name: req.body.name,
    // email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
    new:true,
    runValidators:true,
    useFindAndModify:false,

  });
  res.status(200).json({
    success: true,
     
  });

});


//--------------------- delete user role(Admin)--------------

exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{
  
  const user = await User.findById(req.params.id);

if(!user){
    return next(new ErrorHander(`user not exist with id : ${req.params.id}`));

  }
 await user.remove();
  res.status(200).json({
    success: true,
    message:"User deleted Succesfully"
     
  });

})