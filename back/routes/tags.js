const pool = require('../data/pg.js');
const express = require('express');
const router = express.Router();

router
    .get('/', async (req,res)=> {
        const result = await pool.query('SELECT * FROM tags');
        res.json(result.rows);
        res.status(200).end();
    })

    .get('/:tagname', async (req,res) => {
        const result = await pool.query('SELECT * FROM tags where tag=$1', [req.params.tagname]);
        console.log(req.params);
        res.json(result.rows);
        res.status(200).end();
    })

    .post('/', async (req,res) => {
        const result = await pool.query(
            'INSERT INTO tags (tag) VALUES ($1)', 
            [req.body.tagname]);

        res.status(201).end();
    })

    .delete('/:tagname', async (res,req) => {
        const result = await pool.query(
            'DELETE FROM tags WHERE tag=$1', 
            [req.query.tagname]);

        res.status(204).end();
    });
module.exports = router;