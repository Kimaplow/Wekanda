const pool = require('../data/pg.js');
const express = require('express');
const router = express.Router();

router
    .get('/', async (req,res)=> {
        const result = await pool.query('SELECT * FROM tags');
        res.json(result.rows);
    })