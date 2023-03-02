const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'please provide valid email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'please provide password'],
        minlength:6,
    }
})


userSchema.pre('save', async function(){
    let salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.createJWT = function(){
    return jwt.sign({userId: this._id, name: this.name}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    })
}

userSchema.methods.comparePassword = async function(providedPassword){
    return await bcrypt.compare(providedPassword, this.password)
}

module.exports = mongoose.model('User', userSchema)