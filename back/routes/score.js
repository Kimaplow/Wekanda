const pool = require('../data/pg.js');
const express = require('express');
const router = express.Router();

router

    .get('/',
        async (req, res) => {
            const result = await pool.query('SELECT * FROM score');
            res.json(result.rows);
        })

    .get('/quizz/:id_quizz',
        async (req, res) => {
            const result = await pool.query('SELECT * FROM score WHERE id_quizz=$1', [req.params.id_quizz]);
            res.json(result.rows);
        })

    .get('/user/:id_user',
        async (req, res) => {
            const result = await pool.query('SELECT * FROM score WHERE id_user=$1', [req.params.id_user]);
            res.json(result.rows);
        });


module.exports = router;