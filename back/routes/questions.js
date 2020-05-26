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
        })

    .get('/:id_question',
        async (req, res) => {
            const result = await pool.query('SELECT * FROM questions WHERE id_question=$1', [req.params.id_question]);
            if(result.rowCount === 0) {
                return res.status(404).send({error: "Question not found"});
            }
            res.json(result.rows[0]);
        })

    .get('/:id_question/answers', async (req, res) => {
        const result = await pool.query('SELECT * FROM answers WHERE id_question=$1', [req.params.id_question]);
        if(result.rowCount === 0) {
            return res.status(404).send({error: "Answers for this question not found"});
        }
        res.json(result.rows);
    })

    .post('/',
    upload.single('file'), async (req, res) => {
            const result = await pool.query('INSERT INTO questions (id_quizz, question, path_file) VALUES($1, $2, $3) RETURNING id_question',
                [req.body.id_quizz, req.body.question, '']);
            res.status(201).send(result.rows);
        })

    .delete('/:id',
        async (req, res) => {
            const result = await pool.query('DELETE FROM questions WHERE id_question=$1', [req.params.id]);
            if(result.rowCount === 0) {
                return res.status(404).send({error: "Question not found and therefore cant be deleted"});
            }
            res.status(204).end();
        })

    .patch('/:id',
    upload.single('file'), async (req, res) => {

        let result = undefined;

        if (typeof req.body.question !== "undefined") {
            if(typeof req.body.question !== "string")
            return res.status(403).send("Wrong type for answer");
            result = await pool.query('UPDATE questions SET question = $1 WHERE id_question=$2', [req.body.question, req.params.id]);
        }

        if (typeof req.body.path_file !== "undefined" && req.file) {
            if(typeof req.body.path_file !== "string")
            return res.status(403).send("Wrong type for path_file");
            result = await pool.query('UPDATE questions SET path_file = $1 WHERE id_question=$2', [req.body.path_file, req.params.id]);
        }

        if(typeof result === "undefined") {
            return res.status(400).send({
                error: "Wrong input or nothing was provided"
            });
        }
        res.status(204).end();
    });

module.exports = router;