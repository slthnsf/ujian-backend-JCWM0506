const express = require('express')
const router = express.Router()
const { readToken } = require('../config')
const { userController } = require('../controller')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.patch('/deactive', readToken, userController.deactive)
router.patch('/activate', readToken, userController.activate)
router.patch('/close', readToken, userController.closed)

module.exports = router