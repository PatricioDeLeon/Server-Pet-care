var router = require('express').Router();
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
var api = require('./api');

router.use('/',api);


router.get('/', function (req, res) {
    res.status(200).json({ message: 'API connected' })
});


module.exports = router;
