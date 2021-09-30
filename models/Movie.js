const { Schema, model } = require("mongoose")

const movieSchema = new Schema({
    kp_id: {
        type: Number,
        required: true,
        unique: true
    },
    title_ru: String,
    title_en: String,
    year: {
        type: Number,
        required: true,
    },
    countries: {
        type: Array,
        required: true,
    },
    producer: String,
    genres: {
        type: Array,
        required: true,
    },
    actors: {
        type: String,
    },
    description: String,
    premiere: String,
    rating: Number,
    vote: Number,
    poster: {
        type: String,
        required: true,
    },
    player: {
        type: String,
        required: true,
    }
}, {
    collection: 'movies'
})

module.exports = model('Movie', movieSchema)