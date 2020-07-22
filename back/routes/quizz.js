const pool = require('../data/pg.js');
const express = require('express');
const router = express.Router();
const upload = require('../tools/multer_config');
const auth = require('../tools/auth')();

router
    .get('/',
        async (req, res) => {
            const result = await pool.query('SELECT * FROM quizz');
            res.json(result.rows);
        })
        
    .get('/withtags',
        async (req, res) => {
            const result = await pool.query(
                `select quizz.id_quizz, id_creator,title, path_file, difficulty, description, 
            string_agg(tag,',') as tags from quizz left join tagquizz on quizz.id_quizz = tagquizz.id_quizz 
            where tagquizz.id_quizz is not null group by quizz.id_quizz;`);
            res.json(result.rows);
        })
    .get('/:id/tags', async (req, res) => {
        const result = await pool.query('SELECT tag from tagquizz WHERE id_quizz = $1', [req.params.id]);
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
    
    .get('/fromuser', auth.authenticate(), async (req, res) => {
            console.log('USER ID : ', req.user.id)
            const result = await pool.query('SELECT * FROM quizz WHERE id_creator=$1', [req.user.id]);
            if (result.rows.length === 0) {
                return res.status(404).send({
                    error: 'Quizz not found for this user or user does not exist'
                });
            }
            res.json(result.rows);
    })

    .get('/search/:search', async (req, res) => {
        let search2 = req.params.search;
        const result = await pool.query('SELECT * FROM quizz WHERE title ~* $1', [search2]);
        console.log(result.rows);
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
            const result = await pool.query('DELETE FROM quizz WHERE id_quizz = $1', [req.params.id]);
            if (result.rowCount === 0) {
                return res.status(404)
                    .send({
                        error: 'Quizz can\'t be deleted because it doesn\'t exist'
                    });
            }
            res.status(204).end();
        })

    .patch('/:id',
        upload.single('file'), async (req, res) => {

            let result = undefined;

            if (req.body.path_file) {
                result = await pool.query('UPDATE quizz SET path_file=$1 WHERE id_quizz=$2', [req.body.path_file, req.params.id]);
            }

            if (req.body.title) {
                result = await pool.query('UPDATE quizz SET title = $1 WHERE id_quizz=$2', [req.body.title, req.params.id]);
            }

            if (req.body.difficulty) {
                result = await pool.query('UPDATE quizz SET difficulty=$1 WHERE id_quizz=$2', [req.body.difficulty, req.params.id]);
            }
            
            if (req.body.description) {
                result = await pool.query('UPDATE quizz SET description=$1 where id_quizz=$2', [req.body.description, req.params.id]);
            }

            if (result === undefined) {
                return res.status(500).send({
                    error: 'You didnt provide info for one or more field nor quizz doesnt exist'
                });
            } else if (result.rowCount === 0) {
                return res.status(404).send({
                    error: 'Quizz not found and can\'t be patched'
                });
            }
            res.status(204).end();
        })

    .post('/',
        upload.single('file'), async (req, res) => {
            const result = await pool.query(`INSERT INTO quizz (id_creator, title, path_file, difficulty,description) 
            VALUES($1, $2, $3, $4, $5) RETURNING id_quizz`,
                [req.body.id_creator, req.body.title, req.body.path_file, req.body.difficulty, req.body.description]);
            res.status(201).send(result.rows);

        }
    );

module.exports = router;