const pool = require('../data/pg.js');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cfg = require('../tools/config');
const auth = require('../tools/auth')();

router
    .get('/', async (req, res) => {
        const result = await pool.query("select id_user,pseudo,mail from users");
        res.json(result.rows);
    })
    .get('/profile', auth.authenticate(), async (req, res) => {
        const result = await pool.query("select id_user,pseudo,mail from users where id_user=$1", [req.user.id]);
        res.json(result.rows[0]);
    })
    .post('/login', async (req, res) => {
        console.log(req.body.mail,req.body.password);
        if (req.body.mail && req.body.password) {
            const mail = req.body.mail;
            const password = req.body.password;
            const result = await pool.query("select * from users where mail=$1", [mail]);
            const user = result.rows[0];
            if(!user) return res.status(401).send({
                error: "Wrong credentials"
            });
            let isMatching = await bcrypt
                .compare(password, user.password)
                .then(res => {
                    return res;
                })
                .catch(err => console.error(err.message));
            if (!isMatching) return res.status(401).send({
                error: "Wrong credentials"
            });
            else {
                const payload = {
                    id: user.id_user
                }
                const token = jwt.sign(payload, cfg.jwtSecret, {expiresIn:cfg.expiration});
                res.json({
                    token: token
                })
            }
        } else {
            res.status(401).end();
        }
    })
    .post('/signup', async (req, res) => {
        if (req.body.pseudo && req.body.mail && req.body.password) {
            const pseudo = req.body.pseudo;
            const mail = req.body.mail;
            const plainPassword = req.body.password;
            let hashed = "";
            await bcrypt.genSalt(cfg.saltRounds)
                .then(salt => {
                    return bcrypt.hash(plainPassword, salt);
                })
                .then(hash => {
                    hashed = hash;
                })
                .catch(err => console.error(err.message));
            await pool.query("insert into users(pseudo,mail,password) values($1,$2,$3)", [pseudo, mail, hashed]);
            res.status(201).end();
        } else {
            res.status(401).end();
        }
    })
    .delete('/:id', async (req,res) => {
        const result = await pool.query('DELETE FROM users WHERE id_user=$1', [req.params.id]);
        if(result.rowCount === 0) {
            return res.status(404).send({error: "User not found and therefore cant be deleted"});
        }
        res.status(204).end();
    });

module.exports = router;