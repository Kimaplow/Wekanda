const express = require("express");
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const app = express();

const router_answers = require('./routes/answers');
const router_quizz = require('./routes/quizz');
const router_questions = require('./routes/questions');
const router_users = require('./routes/users');


const pool = require('./data/pg');
const fileUpload = require('express-fileupload');
const port = process.env.PORT || 8000;

app
    .use(morgan('combined'))
    .use(cors())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({
        extended: true
    }))

    .get('/', (req, res) => res.send({ message: 'Welcome to Wekenda Quizz API' }))

    .use('/quizz', router_quizz)
    .use('/questions', router_questions)
    .use('/answers', router_answers)
    .use('/users', router_users)
    .use(express.static(__dirname + '/public'))

    .get('/test_db', async (req, res) => {
       const result = await pool.query('SELECT NOW()');
       res.send(result.rows);
    });

app.listen(port, () => console.log('Wekanda QUIZZ API server listening on port ' + port));
