const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, Unauthenticated} = require('../errors')

const register = async (req,res) =>{
    const user = await User.create({...req.body})

    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({
        user: {
            name: user.name
        },
        token,
    })
}

const login = async (req,res) =>{
    const {email,password} = req.body

    if(!email || !password){
        throw new BadRequestError("Provide email and password")
    }
    
    const user = await User.findOne({email})
    
    if(!user){
        throw new Unauthenticated("Invalid Credentials")
    }
    
    // Companre password
    const isMatch = await user.comparePassword(password)
    
    if(!isMatch){
        throw new Unauthenticated("Invalid Credentials")
    }

    const token = user.createJWT()

    res.status(StatusCodes.OK).json({
        user: {
            name: user.name
        },
        token
    })
}

module.exports = {login, register}