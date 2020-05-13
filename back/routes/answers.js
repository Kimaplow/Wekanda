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
    .get('/', async (req,res) => {
        const result = await pool.query('SELECT * FROM answers');
        res.json(result.rows);
    })

    .post('/',
        upload.single('fileAnswer'), async (req, res) => {

            await pool.query('INSERT INTO answers(id_question, answer, correct, path_file) VALUES($1, $2, $3, $4)',
                [req.body.id_question, req.body.answer, req.body.correct, req.body.path_file]);
            res.status(201).end();
        }
    )

    .get('/:id', async (req,res) => {
        const result = await pool.query('SELECT * FROM answers WHERE id_answers=$1', [req.params.id]);
        res.json(result.rows);
    })

    .patch('/:id',
        upload.single('fileAnswer'), async (req, res) => {

            if (req.body.answer && req.body.answer !== '') {
                await pool.query('UPDATE answers SET answer=$1 WHERE id_answer=$2', [req.body.answer, req.params.id]);
            }

            if (req.body.correct && req.body.correct !== '') { 
                await pool.query('UPDATE answers SET correct=$1 WHERE id_answer=$2', [req.body.correct, req.params.id]);
            }

            if (req.body.path_file && req.body.path_file !== '') { 
                await pool.query('UPDATE answers SET path_file=$1 WHERE id_answer=$2', [req.body.path_file, req.params.id]);
            }

            res.status(204).end();

        })

    .delete('/:id', async (req,res)=>{
        const result = await pool.query('DELETE FROM answers WHERE id_answer=$1', [req.params.id]);
        res.status(204).end();
    });

module.exports = router;