const express = require('express');
const { getServices, addService } = require('../controllers/services')

const router = express.Router();

router.route('/').get(getServices).post(addService);


module.exports = router;