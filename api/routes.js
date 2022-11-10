var router = require('express').Router();
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
var api = require('./api');
var api_vets = require('./api_vets');

router.use('/',api);
router.use('/vets', api_vets);

router.get('/', function (req, res) {
    res.status(200).json({ message: 'API connected' })
});


module.exports = router;
