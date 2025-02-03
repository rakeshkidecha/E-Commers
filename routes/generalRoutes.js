const express = require('express');

const router = express.Router();

router.use('/',require('./adminRoutes'));
router.use('/category',require('./categoryRoutes'));

module.exports = router;
