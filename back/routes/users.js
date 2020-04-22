const pool = require('../data/pg.js');
const express = require('express');
const router = express.Router();

router
    .get('/', async (req, res) => {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
        res.status(200).end();
    })

    .get('/:id', async (req, res) => {
        const result = await pool.query('SELECT * FROM users WHERE id_user=$1', [req.params.id]);
        res.json(result.rows);
        res.status(200).end();
    })

    

    .post('/', async (req,res) => {
        await pool.query('INSERT INTO users (pseudo,password) VALUES ($1,$2)',[req.body.username,req.body.password]);
        res.status(201).end();
    })

    .delete('/:id', async (res,req) => {
        const result = await pool.query('DELETE FROM users WHERE id_user=$1', 
                                        [req.params.id]);
        res.status(204).end();
    });

module.exports = router;