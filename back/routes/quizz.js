const moveToPath = require('../tools/move_path');

const pool = require('../data/pg.js');
const express = require('express');
const router = express.Router();

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
            group by quizz.id_quizz;`);
            res.json(result.rows);
        })
    .get('/withtags/:tag',
        async (req, res) => {
            const result = await pool.query(`select * from quizz 
        left join tagquizz on quizz.id_quizz = tagquizz.id_quizz where tag=$1;`,[req.params.tag]);
            res.json(result.rows);
        })
    .get('/:id', async (req, res) => {
        if (isNaN(parseInt(req.params.id))) {
            res.send({
                message: 'Wrong input'
            });
            res.status(404).end();
            return;
        }
        const result = await pool.query('SELECT * FROM quizz WHERE id_quizz=$1', [req.params.id]);
        res.json(result.rows);
    })
    .get('/:id/fromuser', async (req, res) => {
        const result = await pool.query('SELECT * FROM quizz WHERE id_creator=$1', [req.params.id]);
        res.json(result.rows);
    })
    .get('/:id/questions',
        async (req, res) => {
            const result = await pool.query('SELECT * FROM questions WHERE id_quizz=$1', [req.params.id]);
            res.json(result.rows);
        })

    .delete('/:id/delete',
        async (req, res) => {
            await pool.query('DELETE FROM quizz WHERE id_quizz = $1', [req.params.id]);
            res.status(201).end();
        })

    .patch('/:id',
        async (req, res) => {

            console.log("ICI");
            console.log(req.params.id);

            if (req.body.title !== '') {
                await pool.query('UPDATE quizz SET title = $1 WHERE id_quizz=$2', [req.body.title, req.params.id]);
            }

            if (req.body.path_file !== '') {
                const moved = moveToPath(req.file.files);
                if(moved){
                    console.log("UPLOAD REUSSI");
                    res.status(201).end();
                }
                await pool.query('UPDATE quizz SET path_file=$1 WHERE id_quizz=$2', [req.body.path_file, req.params.id]);
            }

            if (req.body.difficulty !== '') {
                await pool.query('UPDATE quizz SET difficulty=$1 WHERE id_quizz=$2', [req.body.difficulty, req.params.id]);
            }

            res.status(204).end();

        })

    .post('/',
        async (req, res) => {
            await pool.query('INSERT INTO quizz (title, keywords, path_file) VALUES($1, $2, $3)',
                [req.body.title, req.body.keywords, req.body.path_file]);
            res.status(201).end();
        }
    );

module.exports = router;