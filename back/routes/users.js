const pool = require('../data/pg.js');
const express = require('express');
const router = express.Router();

router.get('/', (req,res) => res.send({message:'Users section'}));

module.exports = router;