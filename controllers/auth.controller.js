require('dotenv').config();

const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: process.env.CACHE_TIMEOUT || 300 }); // 5 minutes default

const {Unauthorized, BadRequest} = require('http-errors');

const User = require('../models/user.schema');

/*
@route /api/auth/register
@desc register a user
@access public
*/
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new BadRequest('Please add all fields');
    }

    // Check if user exists - in cache
    if (cache.get(email)) {
        res.status(400);
        throw new BadRequest('User already exists');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new BadRequest('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // console.log('hashed password:', hashedPassword); do not reveal

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });
    if(user) {
        res.status(201).json({
            message: 'User created successfully',
            user: {
                name: user.name,
                email: user.email,
                id: user._id
            }
        });
    }
    else {
        res.status(400);
        throw new BadRequest('Invalid user data');
    }
});

/*
@route /api/auth/login
@desc login user
@access public
*/
const loginUser = asyncHandler(async (req, res, ) =>{
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new BadRequest('Please add all fields');
    }
    // Check if user exists - in cache
    let user = cache.get(email);
    if(!user)
    {
        user = await User.findOne({ email });
        if (!user) {
            res.status(400);
            throw new BadRequest('User not found');
        }
        cache.set(email, user); // cache the user for 5 minutes
    }
    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(401);
        throw new Unauthorized('Invalid credentials - password does not match');
    }
    // Generate token
    const token = jwt.sign({
        user:{
            name: user.name,
            email: user.email,
            id: user._id
        }
    },
    process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXPIRATION
    });
    res.status(200).json({
        message:'Login successful',
        token:token
    });
})

module.exports = {
    registerUser,
    loginUser
}