const pool = require('../data/pg.js');
const express = require('express');
const router = express.Router();
const multer = require('multer');

var storage = multer.diskStorage(
    {
    destination: function (req, file, cb) {
        console.log(req.file);
        cb(null, './public/img');
    },
    filename: function (req, file, cb) {
        console.log(req.body.path_file);
        cb(null, req.body.path_file);
    }
});

var upload = multer({ storage: storage });

router

    .get('/',
        async (req, res) => {
            const result = await pool.query('SELECT * FROM quizz');
            res.json(result.rows);
            res.status(200).end();
        })

    .get('/withtags',
        async (req, res) => {
            const result = await pool.query(
                `select quizz.id_quizz, id_creator,title, path_file, difficulty, description, 
            string_agg(tag,',') as tags from quizz left join tagquizz on quizz.id_quizz = tagquizz.id_quizz 
            group by quizz.id_quizz;`);
            res.json(result.rows);
            res.status(200).end();
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
        res.status(200).end();
    })

    .get('/:id/fromuser', async (req, res) => {
        const result = await pool.query('SELECT * FROM quizz WHERE id_creator=$1', [req.params.id]);
        res.json(result.rows);
        res.status(200).end();
    })
    
    .get('/:id/questions',
        async (req, res) => {
            const result = await pool.query('SELECT * FROM questions WHERE id_quizz=$1', [req.params.id]);
            res.json(result.rows);
            res.status(200).end();
        })

    .delete('/:id/delete',
        async (req, res) => {
            await pool.query('DELETE FROM quizz WHERE id_quizz = $1', [req.params.id]);
            res.status(201).end();
        })

    .patch('/:id',
        upload.single('file'), async (req, res) => {

            if (req.body.title !== '') {
                await pool.query('UPDATE quizz SET title = $1 WHERE id_quizz=$2', [req.body.title, req.params.id]);
            }

            if (req.body.path_file !== '') {              
                await pool.query('UPDATE quizz SET path_file=$1 WHERE id_quizz=$2', [req.body.path_file, req.params.id]);
            }

            if (req.body.difficulty !== '') {
                await pool.query('UPDATE quizz SET difficulty=$1 WHERE id_quizz=$2', [req.body.difficulty, req.params.id]);
            }

            res.status(204).end();

        })

    .post('/',
        upload.single('file'), async (req, res) => {
            //pr celui qui doit merge (peut-etre) j'ai add ca pour pouvoir recup l'id a la creation
            const result = await pool.query('INSERT INTO quizz (id_creator, title, path_file, difficulty) VALUES($1, $2, $3, $4) RETURNING id_quizz',
                [req.body.id_creator, req.body.title, req.body.path_file, req.body.difficulty]);
            res.json(result.rows);
            res.status(201).end();
        }
    );

module.exports = router;