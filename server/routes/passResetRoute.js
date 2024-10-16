const express = require("express");
const {  requestPasswordReset, resetPassword} = require("../controllers/passResetController");
const router = express.Router();


router.post("/reset-password/:token", resetPassword)
router.post("/reset-link", requestPasswordReset)


module.exports = router