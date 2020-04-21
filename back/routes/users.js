const pool = require('../data/pg.js');
const express = require('express');
const router = express.Router();

router

    .get('/',
        async (req, res) => {
            const result = await pool.query('SELECT * FROM users');
            res.json(result.rows);
        })

    .get('/:id',
        async (req, res) => {
            const result = await pool.query('SELECT * FROM users WHERE id_user=$1', [req.params.id]);
            res.json(result.rows);
        });

module.exports = router;