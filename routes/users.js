const Router = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const authMiddleware = require('../middlewares/auth')

const router = new Router()

router.post(
    '/register',
    [
        check('nickname')
            .trim().escape()
            .not().isEmpty().withMessage('Nickname is required')
            .isLength({ min: 2 }).withMessage('Nickname must be longer than 2')
            .isLength({ max: 36 }).withMessage('Password must be shorter than 36'),
        check('email')
            .trim().escape()
            .not().isEmpty().withMessage('Email is required')
            .isEmail().withMessage('Incorrect Email'),
        check('password')
            .trim().escape()
            .not().isEmpty().withMessage('Password is required')
            .isLength({ min: 6 }).withMessage('Password must be longer than 6')
            .isLength({ max: 30 }).withMessage('Password must be shorter than 30')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json(errors)
            }

            const { nickname, email, password } = req.body

            const candidate = await User.findOne({ email })
            if (candidate) {
                return res.status(400).json({ msg: 'User with such email already exists' })
            }

            const hashPassword = await bcrypt.hash(password, 8)

            const user = new User({
                nickname, email,
                password: hashPassword
            })

            await user.save()

            return res.status(201).json({ msg: 'User was created successfully' })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    }
)

router.post(
    '/login',
    async (req, res) => {
        try {
            const { email, password } = req.body

            const user = await User.findOne({ email })
            if (!user) {
                return res.status(404).json({ msg: 'User with such email not found' })
            }

            const isPasswordValid = await bcrypt.compareSync(password, user.password)
            if (!isPasswordValid) {
                return res.status(400).json({ msg: 'Invalid password' })
            }

            const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' })
            return res.status(200).json({
                token,
                user: {
                    id: user._id,
                    nickname: user.nickname,
                    email: user.email,
                    testResult: user.testResult,
                    favoriteMovies: user.favoriteMovies,
                    watchLaterMovies: user.watchLaterMovies
                }
            })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    }
)

router.get(
    '/auth',
    authMiddleware,
    async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.user.id })

            const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' })
            return res.status(200).json({
                token,
                user: {
                    id: user._id,
                    nickname: user.nickname,
                    email: user.email,
                    testResult: user.testResult,
                    favoriteMovies: user.favoriteMovies,
                    watchLaterMovies: user.watchLaterMovies
                }
            })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    }
)

router.put('/favorite', async (req, res) => {
    const { user_id, movie } = req.body

    try {
        await User.findOneAndUpdate(
            { _id: user_id },
            { $push: { favoriteMovies: movie } },
            { upsert: true }
        )

        return res.status(200).json(movie)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})

router.put('/watchLater', async (req, res) => {
    const { user_id, movie } = req.body

    try {
        await User.findOneAndUpdate(
            { _id: user_id },
            { $push: { watchLaterMovies: movie } },
            { upsert: true }
        )

        return res.status(200).json(movie)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})

router.put('/testResult', async (req, res) => {
    const { user_id, testResult } = req.body

    try {
        await User.findOneAndUpdate({ _id: user_id }, { testResult })

        return res.status(200).json(testResult)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})

module.exports = router