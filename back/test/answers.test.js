const chai = require('chai');
const should = require('chai').should();
const chaiHttp = require('chai-http');
const app = require('../app');
const fs = require('fs');
const path = require('path');

chai.use(chaiHttp);

describe('Answers', () => {
    describe('GET /', () => {
        it('should return 200 and all the answers', function(done) {
            chai
            .request(app)
            .get("/answers")
            .end((err,res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.forEach(answer => {
                    answer.should.be.a('object');
                    answer.should.have.property('id_answer');
                    answer.should.have.property('id_question');
                    answer.should.have.property('answer');
                    answer.should.have.property('correct');
                });
                done();
            });
        });
    });
    describe('GET /:id', () => {
        it('should return 404 if the answer does not exist', function(done) {
            chai
            .request(app)
            .get("/answers/1024")
            .end((err,res) => {
                res.should.have.status(404);
                done();
            });
        });
        it('should return 200 if the answer exists', function(done) {
            chai
            .request(app)
            .get("/answers/3")
            .end((err,res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id_answer');
                res.body.should.have.property('id_question');
                res.body.should.have.property('answer');
                res.body.should.have.property('correct');
                done();
            })
        });
    });
    describe('POST /', () => {
        it('should return 201 and create the answer (with an image)', function(done) {
            this.timeout(10000); // 10s timeout in order to give the image some time tu upload
            chai
                .request(app)
                .post('/answers')
                .field('id_question', 1)
                .field('answer', 'Neo')
                .field('path_file', 'matrix.jpg')
                .field('correct',true)
                .attach('file', fs.readFileSync(path.join(__dirname, '/assets/matrix.jpg')), 'matrix.jpg')
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });
        it('should return 201 and create the answer (without an image)', function(done) {
            this.timeout(10000); // 10s timeout in order to give the image some time tu upload
            chai
                .request(app)
                .post('/answers')
                .field('id_question', 1)
                .field('answer', 'Trinity')
                .field('correct',false)
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });
    });
    describe('PATCH /:id', () => {
        it('should return 400 if the answer does not exist and nothing is provided', function(done) {
            chai
            .request(app)
            .patch("/answers/1024")
            .end((err,res) => {
                res.should.have.status(400);
                done();
            });
        });
        it('should return 403 with a type not allowed for the answer', function(done) {
            chai
            .request(app)
            .patch("/answers/3")
            .send({
                "answer": false
            })
            .end((err,res) => {
                res.should.have.status(403);
                done();
            });
        });
        it('should return 403 with a type not allowed for the correct option', function(done) {
            chai
            .request(app)
            .patch("/answers/3")
            .send({
                "correct":"toto"
            })
            .end((err,res) => {
                res.should.have.status(403);
                done();
            });
        });
        it('should return 400 with a wrong syntax for the answer', function(done) {
            chai
            .request(app)
            .patch("/answers/3")
            .send({
                "answer": ""
            })
            .end((err,res) => {
                res.should.have.status(400);
                done();
            });
        });
        it('should return 204 with a correct answer', function(done) {
            chai
            .request(app)
            .patch("/answers/3")
            .send({
                "answer": "Morpheus"
            })
            .end((err,res) => {
                res.should.have.status(204);
                done();
            });
        });
        it('should return 204 with a correct "correct" option', function(done) {
            chai
            .request(app)
            .patch("/answers/3")
            .send({
                "correct":true
            })
            .end((err,res) => {
                res.should.have.status(204);
                done();
            });
        });
        it('should return 204 with a correct "correct" option and answer', function(done) {
            chai
            .request(app)
            .patch("/answers/3")
            .send({
                "answer": "Matrix",
                "correct": false
            })
            .end((err,res) => {
                res.should.have.status(204);
                done();
            });
        });
    });
    describe("Delete /:id", () => {
        it('should return 404 if the answer does not exist', function(done) {
            chai
            .request(app)
            .delete("/answers/1024")
            .end((err,res) => {
                res.should.have.status(404);
                done();
            });
        });
        it('should return 204 and delete if the answer exists', function(done) {
            chai
            .request(app)
            .delete("/answers/3")
            .end((err,res) => {
                res.should.have.status(204);
                done();
            })
        });
    });
});