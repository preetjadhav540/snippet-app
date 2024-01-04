const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            loweracse: true
        },
        password: {type: String, required: true},
        years_experience: Number,
        programming_languages: [String] 
    },
    {
        toObject: { virtuals:true},
        toJSON: { virtuals:true}
    });

UserSchema.pre('save', async function (next) {
    try {
        const existingUser = await Users.findOne({ username: { $regex: new RegExp(`^${this.username}$`, 'i') } });

        if (existingUser && existingUser._id.toString() !== this._id.toString()) {
            const error = new Error(`Username ${this.username} already exists`);
            return next(error);
        }

        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.virtual('snippets', {
    ref: 'Snippets',
    localField: '_id',
    foreignField: 'user_id'
});
UserSchema.virtual('bookmarks', {
    ref: 'Bookmarks',
    localField: '_id',
    foreignField: 'user_id'
});

const Users = mongoose.model('Users', UserSchema);
module.exports = Users;