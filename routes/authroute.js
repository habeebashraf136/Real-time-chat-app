const express = require('express');
const router = express.Router();
const authcontroller = require('../controllers/authcontroller');
const authmiddleware = require('../middleware/authmiddleware');


router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});


router.post('/register', authcontroller.registeruser);

router.post('/login', authcontroller.getlogin);

router.get('/logout', authcontroller.logoutuser);

router.get('/chatapp', authmiddleware.authUserMiddleware, authcontroller.getchatapp);



module.exports = router;