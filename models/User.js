const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    nickname: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 36,
        trim: true,
    },
    testResult: {
        type: Array,
        required: false,
    },
    favoriteMovies: {
        type: Array,
        required: false
    },
    watchLaterMovies: {
        type: Array,
        required: false
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
},
{
    collection: 'users',
    timestamps: {
        createdAt: true,
        updatedAt: false,
    }
})

module.exports = model('User', UserSchema)