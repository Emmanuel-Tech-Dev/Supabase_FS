const jwt = require("jsonwebtoken");

const generateToken = (user) => { 

    const paylaod = {
        id: user.id,
        name: user.name,
        email: user.email
    }

    return jwt.sign(paylaod , process.env.JWT_SECRET , { expiresIn: "15m" })
}


const generateRefreshToken = (user) => {

    const paylaod = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return jwt.sign(paylaod, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });
}


module.exports = {generateToken , generateRefreshToken}
