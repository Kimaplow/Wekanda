const express = require("express");
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const app = express();

const fileUpload = require('express-fileupload');
const port = process.env.PORT || 8000;

app
    .use(morgan('combined'))
    .use(cors())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({
    extended: true
    }))
    .get('/', (req,res) => res.send({message: 'Welcome to Wekenda Quizz API'}))
    .use(express.static(__dirname + '/public'));

app.listen(port, () => console.log('Wekanda QUIZZ API server listening on port ' + port));
