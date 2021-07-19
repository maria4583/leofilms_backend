const Router = require('express')
const Movie = require('../models/Movie')

const router = new Router()

const LIMIT_MOVIES_ON_PAGE = 12

router.get('/popular', async (req, res) => {
    try {
        const movies = await Movie.find().sort( { 'vote' : -1 } ).limit(LIMIT_MOVIES_ON_PAGE)

        return res.status(200).json(movies)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})

router.get('/new', async (req, res) => {
    try {
        const movies = await Movie.find().sort( { 'year' : -1 } ).limit(LIMIT_MOVIES_ON_PAGE)

        return res.status(200).json(movies)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})

router.get('/search', async (req, res) => {
    const { query } = req.query

    try {
        const movies = await Movie.find( {
            '$or': [
                { title_ru: { '$regex': query, '$options': 'i' }},
                { title_en: { '$regex': query, '$options': 'i' }}
            ]
        }).limit(LIMIT_MOVIES_ON_PAGE).sort({ 'vote' : -1 })

        return res.status(200).json(movies)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})

router.get('/:id', async (req, res) =>{
    try {
        let movie = await Movie.findOne({ kp_id: req.params.id })

        if (!movie) {
            return res.status(404).json({ msg: 'Movie not found' })
        }

        return res.status(200).json(movie)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})

router.get('/', async (req, res) => {
    try {
        const year = req.query.year.split(',')
        const rating = req.query.rating.split(',')
        const genres = req.query.genres.split(',')
        const page = req.query.page || 1

        const offset = (Number(page) - 1) * LIMIT_MOVIES_ON_PAGE

        const total = Math.floor(await Movie.countDocuments({
            year: {$gte: year[0], $lte: year[1]},
            rating: {$gte: rating[0], $lte: rating[1]},
            genres: {$in: genres}
        }) / LIMIT_MOVIES_ON_PAGE)

        const movies = await Movie.find({
            year: {$gte: year[0], $lte: year[1]},
            rating: {$gte: rating[0], $lte: rating[1]},
            genres: {$in: genres}
        }).sort( { 'rating' : -1 } ).skip(offset).limit(LIMIT_MOVIES_ON_PAGE)

        return res.status(200).json({ movies, total })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})

module.exports = router
