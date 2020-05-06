const pool = require('../data/pg.js');
const express = require('express');
const router = express.Router();

router
    .get('/', async (req,res) => {
        const result = await pool.query('SELECT * FROM answers');
        res.json(result.rows);
    })

    .post('/',
        async (req, res) => { console.log("files", req.files); console.log("body", [req.body]);
            await pool.query('INSERT INTO answers(id_question, answer, correct, path_file) VALUES($1, $2, $3, $4)',
                [req.body.id_question, req.body.answer, req.body.correct, req.files.file.name]);
            const moved = moveToPath(req.files.file);
            if(moved) res.status(201).end();
            else res.status(500).send('file not allowed or error during the upload');
    })

    .get('/:id', async (req,res) => {
        const result = await pool.query('SELECT * FROM answers WHERE id_answers=$1', [req.params.id]);
        res.json(result.rows);
    })

    .patch('/:id',
        async (req, res) => {

            if (req.body.answer !== null && req.body.answer !== '') {
                await pool.query('UPDATE answers SET answer=$1 WHERE id_answer=$2', [req.body.answer, req.params.id]);
            }

            if (req.body.correct !== null && req.body.correct !== '') { 
                await pool.query('UPDATE answers SET correct=$1 WHERE id_answer=$2', [req.body.correct, req.params.id]);
            }

            res.status(204).end();

        })

    .delete('/:id', async (req,res)=>{
        const result = await pool.query('DELETE FROM answers WHERE id_answer=$1', [req.params.id]);
        res.status(204).end();
    });

module.exports = router;