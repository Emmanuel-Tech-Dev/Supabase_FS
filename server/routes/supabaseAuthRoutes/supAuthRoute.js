const express = require("express")
const { signUpEmailPassowrd, loginWithEmail, signUpwithMagicLink, signInWithPhone } = require("../../controllers/supabaseAuth/authController")

const router = express.Router()



router.post('/signup' , signUpEmailPassowrd)
router.post('login' , loginWithEmail)
router.post('/login-magic-link' , signUpwithMagicLink)
router.post('/phone-otp' , signInWithPhone)

module.exports = router