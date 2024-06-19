const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true,
        maxLength: 10,
        minLength: 10,
    },
    gender: {
        type: String,
        required: true,
        enum: ['M', 'F'],
        maxLength: 1
    },
    roles: {
        default: [101],
        type: [Number],
        enum: [101, 102]
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },
    refreshToken: [String]
});

module.exports = mongoose.model('User', userSchema);