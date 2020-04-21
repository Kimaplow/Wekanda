const pool = require('../data/pg.js');
const express = require('express');
const router = express.Router();

router
    .get('/',
        async (req, res) => {
            const result = await pool.query('SELECT * FROM questions');
            res.json(result.rows);
            res.status(200).end();
        })

    .get('/:id_question/answers', async (req, res) => {
        const result = await pool.query('SELECT * FROM answers WHERE id_question=$1', [req.params.id_question]);
        res.json(result.rows);
        res.status(200).end();
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

    .patch('/:id', async (req,res) => {
        
        if(req.params.question){
            await pool.query('UPDATE questions SET question = $1 WHERE id_question=$2',[req.body.question, req.params.id]);
        }

        if(req.params.path_file){
            await pool.query('UPDATE questions SET path_file = $1 WHERE id_question=$2',[req.body.path_file, req.params.id]);
        }
        
        res.status(204).end();
    });

module.exports = router;