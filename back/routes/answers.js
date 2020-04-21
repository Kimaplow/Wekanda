const pool = require('../data/pg.js');
const express = require('express');
const router = express.Router();
const moveToPath = require('../tools/move_path');

router
    .get('/', async (req,res) => {
        const result = await pool.query('SELECT * FROM answers');
        res.json(result.rows);
    })
    .post('/',
        async (req, res) => { console.log("files", req.files); console.log("body", [req.body]);
            await pool.query('insert into answers(id_question, answer, correct, path_file) values($1, $2, $3, $4)',
                [req.body.id_question, req.body.answer, req.body.correct, req.files.file.name]);
            const moved = moveToPath(req.files.file);
            if(moved) res.status(201).end();
            else res.status(500).send('file not allowed or error during the upload');
    })

    .get('/:id', async (req,res) => {
        const result = await pool.query('SELECT * FROM answers WHERE id_answers=$1', [req.params.id]);
        res.json(result.rows);
    })
    .delete('/:id', async (req,res)=>{
        const result = await pool.query('DELETE FROM answers WHERE id_answer=$1', [req.params.id]);
        res.status(204).end();
    });

module.exports = router;