const express = require('express');
const router = express.Router();
const {registerUser, loginUser} = require('../controllers/auth.controller')

/* POST Register a new user */
router.post('/register', registerUser);

/* Login and get a JWT token*/
router.post('/login', loginUser);

module.exports = router;