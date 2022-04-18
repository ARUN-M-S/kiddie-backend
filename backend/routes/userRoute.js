const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  getAllUsers,
  getSingleuserDetails,
  updaterole,
  deleteUser,
} = require("../controllers/userController");

const { isAuthenticateduser, authorisedRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticateduser, getUserDetails);
router.route("/password/update").put(isAuthenticateduser, updatePassword);

router
  .route("/admin/users")
  .get(isAuthenticateduser, authorisedRoles("Admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticateduser, authorisedRoles("Admin"), getSingleuserDetails)
  .put(isAuthenticateduser, authorisedRoles("Admin"), updaterole)
  .delete(isAuthenticateduser, authorisedRoles("Admin"), deleteUser);

router.route("/logout").get(logout);

module.exports = router;
