const asyncHandler = require('express-async-handler')
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
        throw new Error('Please add all fields');
    }
    const user = await User.create({
        name,
        email,
        password
    });
    res.status(201).json(user);
});

/*
@route /api/auth/login
@desc login user
@access public
*/
const loginUser = asyncHandler(async (req, res, ) =>{
    res.send('Login user')
})

module.exports = {
    registerUser,
    loginUser
}