const pool = require('../data/pg.js');
const express = require('express');
const router = express.Router();

router

    .get('/',
        async (req, res) => {
            const result = await pool.query('SELECT * FROM quizz');
            res.json(result.rows);
            res.status(200).end();
        })
    .get('/:id', async (req,res) => {
            const result = await pool.query('SELECT * FROM quizz WHERE id_quizz=$1', [req.params.id]);
            res.json(result.rows);
            res.status(200).end();
    })
    .get('/fromuser/:id', async (req,res) => {
            const result = await pool.query('SELECT * FROM quizz WHERE id_creator=$1', [req.params.id]);
            res.json(result.rows);
            res.status(200).end();
    })
    .get('/:id/questions',
        async (req, res) => {
            const result = await pool.query('SELECT * FROM questions WHERE id_quizz=$1', [req.params.id]);
            res.json(result.rows);
            res.status(200).end();
        })

    .delete('/:id/delete',
        async (req,res) => {
            await pool.query('DELETE FROM quizz WHERE id_quizz = $1',[req.params.id]);
            res.status(201).end();
        })

    .patch('/:id',
        async (req,res) => {

            //console.log(req.body.title);
            //console.log(req.body.keywords);
            //console.log(req.body.path_file);

            if(req.body.title){
                await pool.query('UPDATE quizz SET title = $1 WHERE id_quizz=$2',[req.body.title, req.params.id]);
            }

            if(req.body.keywords){
                await pool.query('UPDATE quizz SET keywords=$1 WHERE id_quizz=$2',[req.body.keywords, req.params.id]);
            }

            if(req.body.path_file){
                await pool.query('UPDATE quizz SET path_file=$1 WHERE id_quizz=$2',[req.body.path_file, req.params.id]);
            }

            res.status(204).end();

        })

    .post('/',
        async (req,res) => {
            await pool.query('INSERT INTO quizz (title, keywords, path_file) VALUES($1, $2, $3)',
                [req.body.title, req.body.keywords, req.body.path_file]);
            res.status(201).end();
        }
    );

module.exports = router;