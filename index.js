const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require('dotenv').config({path: '.env'});
const app = express();
const port = process.env.port;



app.use(bodyParser.json());

app.use(function (req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});



// app.use(bodyParser.urlencoded({ extended: true}));
// app.use(bodyParser.json());

app.use(bodyParser.json({limit: "1200mb"}));
app.use(bodyParser.urlencoded({limit: "1200mb", extended: true, parameterLimit:90000}));



const router = require('./api/routes');
app.use('/api', router);


 // app.listen(port, '192.168.100.11');

 // 10.1.127.83

 // home 192.168.100.11 

app.listen(port, () => {
    console.log(`Server  running on port: ${port}`);
});