const express = require('express');

const router = express.Router();

router.use('/',require('./adminRoutes'));

module.exports = router;
