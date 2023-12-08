const express = require('express')
const router = express.Router()
const TuiterController = require('../controllers/TuiterController')

//helper
const checkAuth = require('../helpers/auth').checkAuth

router.get('/add', checkAuth, TuiterController.createTuit)
router.post('/add', checkAuth, TuiterController.createTuitSave)
router.get('/dashboard', checkAuth, TuiterController.dashboard)
router.post('/remove', checkAuth, TuiterController.removeTuit)
router.get('/', TuiterController.showTuits)


module.exports = router