const pool = require('../data/pg.js');
const express = require('express');
const router = express.Router();

router

    .get('/',
        async (req, res) => {
            const result = await pool.query('SELECT * FROM quizz');
            res.json(result.rows);
        })

    .get('/:keyword/search',
        async (req, res) => {
            let key = req.params.keyword;
            const result = await pool.query("SELECT * FROM quizz WHERE keywords LIKE '%" + key + "%' ");
            res.json(result.rows);
        })

    .get('/:id/questions',
        async (req, res) => {
            const result = await pool.query('SELECT * FROM questions WHERE id_quizz=$1', [req.params.id]);
            res.json(result.rows);
        })

    .get('/:id/questions/:id_question',
        async (req, res) => {
            const result = await pool.query('SELECT * FROM questions WHERE id_quizz=$1 AND id_question=$2', [req.params.id, req.params.id_question]);
            //res.send({message: req.params.id + ' // ' + req.params.id_question});
            res.json(result.rows);
        })

    .delete('/:id/delete',
        async (req,res) => {
            await pool.query('DELETE FROM quizz where id_quizz = $1',[req.params.id]);
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
            await pool.query('INSERT INTO quizz (title, keywords, path_file) values($1, $2, $3)',
                [req.body.title, req.body.keywords, req.body.path_file]);
            res.status(201).end();
        }
    )

;




module.exports = router;