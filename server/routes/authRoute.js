const express = require("express");
const { registerUser, loginUser, refreshToken, logOut, changePassword } = require("../controllers/authController");
const authentication = require("../middleware/authMiddleWare");
const { userLoginValidator, validateLogin } = require("../middleware/userValidate");

const router = express.Router()

router.post('/register' , userLoginValidator, validateLogin, registerUser)
router.post('/login' , loginUser)
router.post('/token/refresh' , refreshToken)
router.post('/logout' , logOut)
router.post('/changepassword' , authentication, changePassword)



router.get('/user/profile' ,authentication, (req , res)=>{
     res.status(200).json({message : 'Your are authenticated!' , user : req.user})
})


module.exports = router