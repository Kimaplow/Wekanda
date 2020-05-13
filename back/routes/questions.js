const pool = require('../data/pg.js');
const express = require('express');
const router = express.Router();
const multer = require('multer');

let storage = multer.diskStorage(
    {
    destination: function (req, file, cb) {
        cb(null, './public/img');
    },
    filename: function (req, file, cb) {
        cb(null, req.body.path_file);
    }
});

let upload = multer({ storage: storage });

router
    .get('/',
        async (req, res) => {
            const result = await pool.query('SELECT * FROM questions');
            res.json(result.rows);
            res.status(200).end();
        })

    .get('/:id_question',
        async (req, res) => {
            const result = await pool.query('SELECT * FROM questions WHERE id_question=$1', [req.params.id_question]);
            res.json(result.rows);
            res.status(200).end();
        })

    .get('/:id_question/answers', async (req, res) => {
        const result = await pool.query('SELECT * FROM answers WHERE id_question=$1', [req.params.id_question]);
        res.json(result.rows);
        res.status(200).end();
    })

    .post('/',
        async (req, res) => {
            await pool.query('INSERT INTO questions (id_quizz, question, path_file) VALUES($1, $2, $3)',
                [req.body.id_quizz, req.body.question, '']);
            res.status(201).end();
        }
    )

    .delete('/:id',
        async (req,res) => {
            await pool.query('DELETE FROM questions WHERE id_question=$1', [req.params.id]);
            res.status(201).end();
    })

    .patch('/:id',
        upload.single('fileQuestion'), async (req,res) => {
        
        if(req.body.question && req.body.question !== ''){
            await pool.query('UPDATE questions SET question = $1 WHERE id_question=$2',[req.body.question, req.params.id]);
        }

        if(req.body.path_file && req.body.path_file !== ''){
            await pool.query('UPDATE questions SET path_file = $1 WHERE id_question=$2',[req.body.path_file, req.params.id]);
        }
        
        res.status(204).end();
    });

module.exports = router;