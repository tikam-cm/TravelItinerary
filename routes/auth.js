var express = require('express');
var router = express.Router();

/* POST Register a new user */
router.post('/register', function(req, res, next) {
    res.send('Register user')
});

/* Login and get a JWT token*/
router.post('/login', function(req, res, next){
    res.send('Login user')
});

module.exports = router;