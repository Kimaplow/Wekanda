const pool = require('../data/pg.js');
const express = require('express');
const router = express.Router();

router
    .get('/',
        async (req, res) => {
            const result = await pool.query('SELECT * FROM questions');
            res.json(result.rows);
        })

    .post('/',
        async (req, res) => { console.log("files", req.files); console.log("body", [req.body]);
            await pool.query('INSERT INTO pictures(id_quizz,question,path_file) VALUES($1,$2,$3)',
                [req.body.id_quizz, req.body.question, req.files.file.name] );
            const moved = moveToPath(req.files.file);
            if(moved) res.status(201).end();
            else res.status(500).send('file not allowed or error during the upload');
        })

    .delete('/:id',
        async (req,res) => {
            const result = await pool.query('DELETE FROM questions WHERE id_question=$1', [req.params.id]);
            res.status(204);
    })
    .get('/:id_question/answers',
        async (req, res) => {
            const result = await pool.query('SELECT * FROM answers WHERE id_question=$1', [req.params.id_question]);
            res.json(result.rows);
    });

module.exports = router;