const dotenv = require('dotenv');
dotenv.config();

const mysql = require('mysql2');

let connection = mysql.createConnection({
    host: 'us-east.connect.psdb.cloud',
    database: 'pet_care_db',
    user: 'ruifq7ght0416tk7m2da',
    password: 'pscale_pw_K5G6wJ5JsGmDvaQxn9h0ADQr7EIwOaQG6uoOAyGvurJ',
    ssl:{
        rejectUnauthorized:false
    }
});

connection.connect(function(err){

    if(err){
        throw err;
    }else{
        console.log('db connected');
    }

})

module.exports = connection;