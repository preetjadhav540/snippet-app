const bcrypt = require('bcrypt');
const User = require('./users.models');
const util = require('../util/index');
const config = require('../../config.json');                   
const jwt = require('jsonwebtoken');

const getUsers  = async (req, res) => {
    try {
        const users = await User.find().populate('snippets').populate('bookmarks');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getUserById = async (req, res) => {
    const { params, query } = req;
    const id = params.id;

    const showSnippets = util.queryToBoolean(query.snippets);
    const showBookmarks = util.queryToBoolean(query.bookmarks);

    let user = await User.findById(id);
    try {
        const virtuals = [];
        if (showSnippets && showBookmarks) {
            virtuals.push('snippets');
            virtuals.push('bookmarks');
        }
        else if (showSnippets) {
            virtuals.push('snippets');
        }
        else if (showBookmarks) {
            virtuals.push('bookmarks');
        }
        const user = await User.findById(id).select('-password').populate(virtuals);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: `No user found by id: ${id}` });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const registerUser = async (req, res) => {
    const { body } = req;
    const { password, username } = body;

    if (!password || !username) {
        return res
        .status(400)
        .json({ error: 'Username and Password is required' });
        
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const user = new User({...body, password: hashed});
        const saved = await user.save();
        const result = saved.toObject();
        delete result.password;

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username: username.toLowerCase() });
        if(!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const authenticated = await bcrypt.compare(password, user.password);
        if (authenticated){
            const token = jwt.sign({ id: user._id, username: user.username }, config.jwtsecret, { expiresIn: '24h' });
        
        const authorized = user.toObject();
        delete authorized.password;
        res.header('Authorization', `Bearer ${token}`).json(authorized);
        } else {
            res.status(400).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};


const updateUser = async (req, res) => {
    const { params, body } = req;
    const id = params.id;

    try {

        delete body.password;
        const existingUser = await User.findOne({
            username: { $regex: new RegExp(`^${body.username}$`, 'i') },
            _id: { $ne: id } 
        });

        if (existingUser) {
            res.status(400).json({ error: `Username ${body.username} already exists` });
            return;
        }


        const updatedUser = await User.findOneAndUpdate({ _id: id }, body, { new: true }).select('-password');

        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).json({ error: `No User found by id: ${id}` });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};


module.exports = {
    getUsers,
    getUserById,
    registerUser,
    loginUser,
    updateUser
};