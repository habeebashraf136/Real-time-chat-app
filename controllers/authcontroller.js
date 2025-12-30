const usermodel = require('../models/usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const message = require('../models/messeage.model');


module.exports.registeruser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const UserAllreadyExist = await usermodel.findOne({ email });
        if (UserAllreadyExist) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await usermodel.create({
            username,
            email, 
            password: hashedPassword
        });
        await user.save();

        const token = jwt.sign(
        { userId: user._id},
        process.env.JWT_SECRET_KEY
        );

        res.cookie('token', token);

    //     res.status(201).json({ message: 'User registered successfully',
    //         userId: user._id,
    //         username: user.username,
    //         email: user.email
    //   });
       res.redirect('/auth/chatapp');
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports.getlogin = async (req, res) => {
    const { email, password } = req.body;

    const user = await usermodel.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    } 
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
        { id: user._id },   // ✅ change userId → id
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1d' }
    );

    res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax'
    });
    
    res.redirect('/auth/chatapp');
}

module.exports.logoutuser = (req, res) => {
    res.clearCookie('token');
    res.redirect('/auth/login');
}

module.exports.getchatapp = async (req, res) => {
    const messages = await message.find().sort({ timestamp: 1 });
    const user = req.user; // Assuming user info is attached to req object after authentication
    res.render('chatapp', { messages: messages, user: { username: user.username, email: user.email } });
}