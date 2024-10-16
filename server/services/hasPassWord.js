const bcrypt = require('bcrypt')


const hasPassword = async (password) => {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
}

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword)
}

module.exports = { hasPassword, comparePassword }