const pool = require('../data/pg.js');
const express = require('express');
const router = express.Router();
router
    .get('/',
        async (req, res) => {
            const result = await pool.query('SELECT * FROM tagQuizz');
            res.json(result.rows);
            res.status(200);
        })

    .get('/:id_quizz',
        async (req, res) => {
            const result = await pool.query('SELECT tag FROM tagQuizz WHERE id_quizz=$1', [req.params.id_quizz]);
            res.json(result.rows);
            res.status(200);
        })

    .post("/",
        async (req, res) => {
            const result = await pool.query("INSERT INTO tagQuizz(id_quizz, tag) values($1,$2)", [req.body.id_quizz, req.body.tag]);
            res.status(201).end();
        })

    .delete('/:id_quizz/:tag',
        async (req, res) => {
            await pool.query('DELETE FROM tagQuizz WHERE id_quizz=$1 AND tag=$2', [req.params.id_quizz, req.params.tag]);
            res.status(204).end();
        });

module.exports = router;