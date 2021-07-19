const { Schema, model } = require("mongoose")

const movieSchema = new Schema({
    kp_id: {
        type: Number,
        required: true,
        unique: true
    },
    title_ru: {
        type: String,
    },
    title_en: {
        type: String,
    },
    year: {
        type: Number,
        required: true,
    },
    countries: {
        type: Array,
        required: true,
    },
    producer: {
        type: String,
    },
    genres: {
        type: Array,
        required: true,
    },
    actors: {
        type: String,
    },
    description: {
        type: String,
    },
    premiere: {
        type: String,
    },
    rating: {
        type: Number,
    },
    vote: {
        type: Number,
    },
    poster: {
        type: String,
        required: true,
    },
    player: {
        type: String,
        required: true,
    }
},
{
    collection: 'movies'
})

module.exports = model("movies", movieSchema)