const pool = require('../data/pg.js');
const express = require('express');
const router = express.Router();
const upload = require('../tools/multer_config');


router
    .get('/', async (req, res) => {
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

    .get('/:id', async (req, res) => {
        const result = await pool.query('SELECT * FROM answers WHERE id_answer=$1', [req.params.id]);
        if (result.rowCount === 0) {
            res.status(404).send({
                error: "Answer not found for this id"
            });
        }
        res.json(result.rows[0]);
    })
    .patch('/:id',
        upload.single('fileAnswer'), async (req, res) => {
            let result = undefined;

            if (typeof req.body.answer !== "undefined") {
                if (typeof req.body.answer !== "string" ) { // check for syntax error
                    return res.status(403).send("Wrong type for the answer");
                } 
                if(req.body.answer === "")  // check for empty string
                return res.status(400).send({error:"Syntax error"});
                result = await pool.query('UPDATE answers SET answer=$1 WHERE id_answer=$2', [req.body.answer, req.params.id]);
                if (result.rowCount === 0) {
                    return res.status(404).send({
                        error: "Answer not found for this id"
                    });
                }
            }

            if (typeof req.body.correct !== "undefined") {
                if (req.body.correct !== "true" && req.body.correct !== "false")
                    return res.status(403).send("Wrong type for the correct option"); 
                result = await pool.query('UPDATE answers SET correct=$1 WHERE id_answer=$2', [req.body.correct, req.params.id]);
                if (result.rowCount === 0) {
                    return res.status(404).send({
                        error: "Answer not found for this id"
                    });
                }
            }

            if (req.body.path_file) {
                result = await pool.query('UPDATE answers SET path_file=$1 WHERE id_answer=$2', [req.body.path_file, req.params.id]);
            }
            
            if(typeof result === "undefined") {
                return res.status(400).send({
                    error: "Wrong input or nothing was provided"
                });
            } 
            
            return res.status(204).end();
        })

    .delete('/:id', async (req, res) => {
        const result = await pool.query('DELETE FROM answers WHERE id_answer=$1', [req.params.id]);
        if (result.rowCount === 0) {
            res.status(404).send({
                error: "Answer not found for this id"
            });
        }
        res.status(204).end();
    });

module.exports = router;
