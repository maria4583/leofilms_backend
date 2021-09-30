const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    nickname: {
        type: String,
        minLength: 2,
        maxLength: 36,
        trim: true,
        required: true,
    },
    testResult: {
        type: Array,
        default: [],
        required: false,
    },
    favoriteMovies: [{
        type: Schema.Types.ObjectId,
        ref: 'Movie'
    }],
    watchLaterMovies: [{
        type: Schema.Types.ObjectId,
        ref: 'Movie'
    }],
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