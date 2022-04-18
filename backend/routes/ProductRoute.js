const express = require ("express");
const { getAllProducts,createProduct, updateProduct, deleteProduct, getProductDetails } = require("../controllers/productController");
const { isAuthenticateduser,authorisedRoles } = require("../middleware/auth");
const router = express.Router();
 router.route("/products").get( isAuthenticateduser,getAllProducts);



 router.route("/product/admin/new").post(isAuthenticateduser,authorisedRoles("Admin"),createProduct);

 

 router.route("/product/admin/:id").put(isAuthenticateduser,authorisedRoles("Admin"),updateProduct).delete(isAuthenticateduser,authorisedRoles("Admin"),deleteProduct);
 router.route("/product/:id").get(getProductDetails);
 






module.exports = router