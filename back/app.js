const express = require("express");
const cors = require('cors');
const morgan = require('morgan');
const app = express();

const router_answers = require('./routes/answers');
const router_quizzes = require('./routes/quizz');
const router_questions = require('./routes/questions');
const router_users = require('./routes/users');
const router_scores = require('./routes/score');
const router_tags_quizzes = require('./routes/tag_quizz');
const router_tags = require('./routes/tags');

const pool = require('./data/pg');
const fileUpload = require('express-fileupload');
const port = process.env.PORT || 8000;

app
    .use(morgan('combined'))
    .use(cors())
    .use(express.json())
    .use(express.urlencoded({extended:true}))
    .get('/', (req, res) => res.send({ message: 'Welcome to Wekenda Quizz API' }))
    .get('/test_db', async (req, res) => {
        const result = await pool.query('SELECT NOW()')
        res.send(result.rows);
     })
    .use('/quizzes', router_quizzes)
    .use('/questions', router_questions)
    .use('/answers', router_answers)
    .use('/users', router_users)
    .use('/scores', router_scores)
    .use('/tagsquizzes', router_tags_quizzes)
    .use('/tags', router_tags)
    .use(express.static(__dirname + '/public'));

app.listen(port, () => console.log('Wekanda QUIZZ API server listening on port ' + port));
