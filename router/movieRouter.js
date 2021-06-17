const express = require('express')
const router = express.Router()
const { readToken } = require('../config')
const { movieController } = require('../controller')

router.get('/get', movieController.getMovies)
router.post('/add', readToken, movieController.addMovies)
router.patch('/edit/:id', readToken, movieController.editMovies)
router.patch('/set/:id', readToken, movieController.addSchedule)

module.exports = router