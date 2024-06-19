const bcrypt = require('bcrypt');
const User = require('../models/user');
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const cookies = req.cookies;
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ 'message': 'Bad request - Username and Password are required' });

    const foundUser = await User.findOne({ username }).exec();
    if (!foundUser) return res.status(401).json({ 'message': 'unauthorized' });

    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign(
            {
                'userInfo': {
                    'username': foundUser.username,
                    'roles': roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );
        const newRefreshToken = jwt.sign(
            { 'username': foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        let newRefreshTokenArray =
            !cookies?.jwt
                ? foundUser.refreshToken
                : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);

        if (cookies?.jwt) {

            const refreshToken = cookies.jwt;
            const foundToken = await User.findOne({ refreshToken }).exec();
            if (!foundToken) {
                newRefreshTokenArray = [];
            }

            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });//put secure:true
        }
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const query = await foundUser.save();

        res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }); //put secure:true
        res.json({
            'success': `User ${username} is logged in!`,
            accessToken
        });
    } else {
        res.status(401).json({ 'message': 'unauthorized' });
    }
};

const handleSignup = async (req, res, next) => {
    const { username, password, mail, firstName, lastName, mobile, gender, isAdmin } = req.body;
    if (!username || !password) return res.status(400).json({ 'message': 'Bad request - Username and Password are required' });
    if (password.length < 8) return res.status(400).json({ 'message': 'password must have minimun length of 8 characters' });

    const duplicateUser = await User.findOne({ username }).exec();
    if (duplicateUser) return res.status(409).json({ 'message': 'Conflict - User already exists!' });
    const duplicateMail = await User.findOne({ mail }).exec();
    if (duplicateMail) return res.status(409).json({ 'message': 'Conflict - User already exists with this mail' });

    const regexUser = /^[A-Za-z][A-Za-z_0-9]{7,30}$/g;
    const regexMail = /^[a-zA-Z0-9-.]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/gm;
    const validUser = regexUser.test(username);
    const validMail = regexMail.test(mail);
    if (!validUser) return res.status(406).json({ 'message': 'Not acceptable - Username should contain only alphabets or numbers or underscore and minimun 8 characters required' });
    if (!validMail) return res.status(406).json({ 'message': 'Not acceptable - Mail should be correctly formatted' });

    if (isAdmin && !(await bcrypt.compare(adminKey, process.env.ADMIN_SECRET_KEY_HASH))) return res.status(400).json({ 'message': 'invalid adminKey' });
    try {
        if (!isAdmin) {
            const pwdhash = await bcrypt.hash(password, 10);

            const query = await User.create({
                username,
                password: pwdhash,
                mail,
                firstName,
                lastName,
                mobile,
                gender
            });
            await query.save();

            res.status(201).json({ 'success': 'Created - User created' });
        }
        else {
            const pwdhash = await bcrypt.hash(password, 12);
            const user = new User({
                username,
                password: pwdhash,
                mail,
                firstName,
                lastName,
                mobile,
                gender
            });
            const admin = new Admin({
                user: user._id
            });
            await admin.save();

            user.roles.push(102);
            user.admin = admin._id;
            await user.save();

            res.status(201).json({ 'success': 'Created - Admin created' });
        }
    }
    catch (err) {
        next(err);
    }
};

module.exports = { handleLogin, handleSignup };