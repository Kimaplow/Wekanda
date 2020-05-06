const pool = require('../data/pg.js');
const express = require('express');
const router = express.Router();
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(req.file);
        cb(null, './public/img');
    },
    filename: function (req, file, cb) {
        console.log(req.body.path_file);
        cb(null, req.body.path_file);
    }
});

var upload = multer({
    storage: storage
});

router

    .get('/',
        async (req, res) => {
            const result = await pool.query('SELECT * FROM quizz');
            res.json(result.rows);
        })
    .get('/withtags',
        async (req, res) => {
            const result = await pool.query(
                `select quizz.id_quizz, id_creator,title, path_file, difficulty, 
            string_agg(tag,',') as tags from quizz left join tagquizz on quizz.id_quizz = tagquizz.id_quizz 
            where tagquizz.id_quizz is not null group by quizz.id_quizz;`);
            res.json(result.rows);
        })
    .get('/withtags/:tag',
        async (req, res) => {
            const result = await pool.query(`select * from quizz 
        left join tagquizz on quizz.id_quizz = tagquizz.id_quizz where tag=$1;`, [req.params.tag]);
            if (result.rows.length === 0) {
                return res.status(404).send({
                    error: 'Tag does not exist or has not been written correctly'
                });
            }
            res.json(result.rows);
        })
    .get('/:id', async (req, res) => {
        if (isNaN(+req.params.id)) {
            return res.status(500).send({
                error: 'Input given is not a number'
            });
        }
        const result = await pool.query('SELECT * FROM quizz WHERE id_quizz=$1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).send({
                error: 'Quizz not found'
            });
        }
        res.json(result.rows[0]);
    })
    .get('/:id/fromuser', async (req, res) => {
        const result = await pool.query('SELECT * FROM quizz WHERE id_creator=$1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).send({
                error: 'Quizz not found for this user or user does not exist'
            });
        }
        res.json(result.rows);
    })
    .get('/:id/questions',
        async (req, res) => {
            const result = await pool.query('SELECT * FROM questions WHERE id_quizz=$1', [req.params.id]);
            if (result.rows.length === 0) {
                return res.status(404)
                    .send({
                        error: 'questions not found for this quizz or quizz does not exist'
                    });
            }
            res.json(result.rows);
        })

    .delete('/:id/delete',
        async (req, res) => {
            const result = await pool.query('DELETE FROM quizz WHERE id_quizz = $1', [req.params.id], (err, res) => {
                if (err) return;
                else return res;
            });
            if (result === undefined) {
                return res.status(404)
                    .send({
                        error: 'Quizz can\'t be deleted because it doesn\'t exist'
                    });
            }
            res.status(204).send(res);
        })

    .patch('/:id',
        upload.single('file'), async (req, res) => {

            if (req.body.title !== '') {
                await pool.query('UPDATE quizz SET title = $1 WHERE id_quizz=$2', [req.body.title, req.params.id]);
            }

            if (req.body.path_file !== '') {
                await pool.query('UPDATE quizz SET path_file=$1 WHERE id_quizz=$2', [req.body.path_file, req.params.id]);
            }

            if (req.body.difficulty !== '') {
                await pool.query('UPDATE quizz SET difficulty=$1 WHERE id_quizz=$2', [req.body.difficulty, req.params.id]);
            }

            res.status(204).end();

        })

    .post('/',
        upload.single('file'), async (req, res) => {
            console.log("=== BACK QUIZZ ===")
            const result = await pool.query('INSERT INTO quizz (id_creator, title, path_file, difficulty) VALUES($1, $2, $3, $4)',
                [req.body.id_creator, req.body.title, req.body.path_file, req.body.difficulty]);
            res.status(201).end();
        }
    );

module.exports = router;