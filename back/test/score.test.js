const chai = require('chai');
const should = require('chai').should();
const chaiHttp = require('chai-http');
const app = require('../app');
const fs = require('fs');
const path = require('path');

chai.use(chaiHttp);

describe('Scores', () => {
    describe('GET /scores', () => {
        it('should return 200 and all the scores', function (done) {
            chai
                .request(app)
                .get("/scores")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.forEach(score => {
                        score.should.be.a('object');
                        score.should.have.property('id_score');
                        score.should.have.property('id_user');
                        score.should.have.property('id_quizz');
                        score.should.have.property('score');
                    });
                    done();
                });
        });
    });
    describe('GET /:id_quizz/quizz', () => {
        it('should return 200 and all the scores for a quizz if it ewists', function (done) {
            chai
                .request(app)
                .get("/scores/1/quizz")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.forEach(score => {
                        score.should.be.a('object');
                        score.should.have.property('id_score');
                        score.should.have.property('id_user');
                        score.should.have.property('id_quizz');
                        score.should.have.property('score');
                    });
                    done();
                });
        });
        it('should return 404 if the quizz doesnt exist', function (done) {
            chai
                .request(app)
                .get("/scores/1024/quizz")
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
    describe('GET /:id_user/user', () => {
        it('should return 200 and all the scores for a quizz if it exists', function (done) {
            chai
                .request(app)
                .get("/scores/1/user")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.forEach(score => {
                        score.should.be.a('object');
                        score.should.have.property('id_score');
                        score.should.have.property('id_user');
                        score.should.have.property('id_quizz');
                        score.should.have.property('score');
                    });
                    done();
                });
        });
        it('should return 404 if the user doesnt exist', function (done) {
            chai
                .request(app)
                .get("/scores/1024/user")
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
    describe('GET /:id_user/user/:id_quizz/quizz', () => {
        it('should return 404 with an incorrect id_user but correct id_quizz', function (done) {
            chai
                .request(app)
                .get("/scores/1024/user/1/quizz")
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
        it('should return 404 with a correct id_user but incorrect id_quizz', function (done) {
            chai
                .request(app)
                .get("/scores/1/user/1024/quizz")
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
        it('should return 404 with an incorrect id_user and incorrect id_quizz', function (done) {
            chai
                .request(app)
                .get("/scores/1024/user/1024/quizz")
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
        it('should return 200 with a correct filter (highest)', function (done) {
            chai
                .request(app)
                .get("/scores/1/user/4/quizz")
                .query({filter:'highest'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('max');
                    done();
                });
        });
        it('should return 200 with a correct filter (lowest)', function (done) {
            chai
                .request(app)
                .get("/scores/1/user/4/quizz")
                .query({filter:'lowest'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('min');
                    done();
                });
        });
        it('should return max and 200 with an incorrect filter', function (done) {
            chai
                .request(app)
                .get("/scores/1/user/4/quizz")
                .query({filter:'lowast'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('max');
                    done();
                });
        });
        it('should return 200 with a correct id_user,quizz and without filter', function (done) {
            chai
                .request(app)
                .get("/scores/1/user/4/quizz")
                .query()
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.forEach(score => {
                        score.should.be.a('object');
                        score.should.have.property('id_score');
                        score.should.have.property('id_user');
                        score.should.have.property('id_quizz');
                        score.should.have.property('score');
                    });
                    done();
                });
        });
    });
    describe('POST /', () => {
        it('should return 201 with good infos', function (done) {
            chai
                .request(app)
                .post('/scores')
                .send({
                    id_user: 1,
                    id_quizz: 1,
                    score: 10
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });
    });

});