const pool = require('../data/pg.js');
const express = require('express');
const router = express.Router();
const auth = require('../tools/auth')();

router
.get('/',
async (req, res) => {
    const result = await pool.query('SELECT * FROM score');
    res.json(result.rows);
})

.get('/:id_quizz/quizz',
async (req, res) => {
    const result = await pool.query('SELECT * FROM score WHERE id_quizz=$1', [req.params.id_quizz]);
    if(result.rowCount === 0) {
        return res.status(404).send({error:'Scores for this quizz not found!'});
    }
    res.json(result.rows);
})
.get('/:id_quizz/quizz/max',
    async (req, res) => {
        const result = await pool.query(`
        select pseudo, MAX(score) as highest 
        from score inner join wekanda.users on users.id_user = score.id_user where id_quizz=$1 
        GROUP BY pseudo ORDER BY highest DESC  limit 1;`, [req.params.id_quizz]);
        if(result.rowCount === 0) {
            return res.status(404).send({error:'Scores for this quizz not found!'});
        }
        res.json(result.rows[0]);
    })

.get('/user',
auth.authenticate(), async (req, res) => {
            const result = await pool.query('SELECT * FROM score WHERE id_user=$1', [req.user.id]);
            if(result.rowCount === 0) {
                return res.status(404).send({error:'Scores for this quizz not found!'});
            }
            res.json(result.rows);
        })

    .get('/:id_user/user/:id_quizz/quizz',
        async (req, res) => {
            let result = '';
            if (req.query.filter !== undefined) { // Retrieve the max or min score of a user for a given quizz
                switch (req.query.filter) {
                    case 'highest':
                        result = await pool.query('SELECT MAX(score) FROM score WHERE id_user=$1 AND id_quizz=$2',
                            [req.params.id_user, req.params.id_quizz]);
                        break;
                    case 'lowest':
                        result = await pool.query('SELECT MIN(score) FROM score WHERE id_user=$1 AND id_quizz=$2',
                            [req.params.id_user, req.params.id_quizz]);
                        break;
                    default:  // Take highest by default
                        result = await pool.query('SELECT MAX(score) FROM score WHERE id_user=$1 AND id_quizz=$2',
                            [req.params.id_user, req.params.id_quizz]);   
                }
                return res.json(result.rows[0]);
            } else {
                // If no filter we retrive all the scores of a user for a given quizz
                result = await pool.query('SELECT * FROM score WHERE id_user=$1 AND id_quizz=$2',
                    [req.params.id_user, req.params.id_quizz]);
            }
            if(result.rowCount === 0) {
                return res.status(404).send({error:'Scores for this quizz not found or user doesnt exist!'});
            }
            res.json(result.rows);
        })
        .post('/', 
        async(req,res) => {
            const result = await pool.query('INSERT INTO score (id_user,id_quizz,score) VALUES ($1,$2,$3)', 
            [req.body.id_user,req.body.id_quizz,req.body.score])
            res.status(201).end();
        });

module.exports = router;