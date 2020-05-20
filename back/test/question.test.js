const chai = require('chai');
const should = require('chai').should();
const chaiHttp = require('chai-http');
const app = require('../app');
const fs = require('fs');
const path = require('path');

chai.use(chaiHttp);

describe('Questions', () => {
    describe('GET /questions', () => {
        it('should return 200 and all the questions', function(done) {
            chai
            .request(app)
            .get("/questions")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.forEach(question => {
                    question.should.be.a('object');
                    question.should.have.property('id_question');
                    question.should.have.property('id_quizz');
                    question.should.have.property('question');
                });
                done();
            });
        });
    });
    describe('GET /:id_question', () => {
        it('should return 404 with a wrong question id', function(done) {
            chai
            .request(app)
            .get("/questions/1024")
            .end((err,res) => {
                res.should.have.status(404);
                done();
            });
        });
        it('should return 200 and the question associated with a correct question id', function(done) {
            chai
            .request(app)
            .get("/questions/1")
            .end((err,res) => {
                res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id_question');
                    res.body.should.have.property('id_quizz');
                    res.body.should.have.property('question');
                done();
            });
        });
    });
    describe('GET /:id_question/answers', () => {
       it('should return 404 with a wrong id question', function(done) {
            chai
            .request(app)
            .get("/questions/1024/answers")
            .end((err,res) => {
                res.should.have.status(404);
                done();
            });
       });
       it('should return 200 with a correct id question', function(done) {
        chai
        .request(app)
        .get("/questions/1/answers")
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.forEach(question => {
                question.should.be.a('object');
                question.should.have.property('id_question');
                question.should.have.property('id_answer');
                question.should.have.property('correct');
            });
            done();
        });
       });
    });
    describe('POST /', () => {
        it('should return 201 and create the question (with an image)', function(done) {
            this.timeout(10000); // 10s timeout in order to give the image some time tu upload
            chai
                .request(app)
                .post('/questions')
                .field('id_quizz', 1)
                .field('question', 'Qui est l\'homme au milieu ?')
                .field('path_file', 'matrix.jpg')
                .attach('file', fs.readFileSync(path.join(__dirname, '/assets/matrix.jpg')), 'matrix.jpg')
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });
        it('should return 201 and create the question (without an image)', function(done) {
            this.timeout(10000); // 10s timeout in order to give the image some time tu upload
            chai
                .request(app)
                .post('/questions')
                .field('id_quizz', 1)
                .field('question', 'Qui est la personne à gauche ?')
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });
    });
    describe('PATCH /:id', () => {
        it('should return 400 if we have a wrong input data', function(done) {
            chai
            .request(app)
            .patch('/questions/1')
            .field('zigzag','toto')
            .end((err,res) => {
                res.should.have.status(400);
                done();
            });
        });
        it('should return 404 if we have an incorrect id', function(done) {
            chai
            .request(app)
            .patch('/questions/1024')
            .end((err,res) => {
                res.should.have.status(400);
                done();
            });
        });
        it('should return 204 with a correct question', function(done) {
            chai
            .request(app)
            .patch('/questions/1')
            .send({
                question: "toto?"
            })
            .end((err,res) => {
                res.should.have.status(204);
                done();
            });
        });
        it('should return 204 with a correct file', function(done) {
            chai
            .request(app)
            .patch('/questions/1')
            .field('path_file','matrix.jpg')
            .attach('file', fs.readFileSync(path.join(__dirname, '/assets/matrix.jpg')), 'matrix.jpg')
            .end((err,res) => {
                res.should.have.status(204);
                done();
            });
        });
        it('should return 204 with a correct file and question', function(done) {
            chai
            .request(app)
            .patch('/questions/2')
            .field('question','Qui est la personne à droite?')
            .field('path_file','matrix.jpg')
            .attach('file', fs.readFileSync(path.join(__dirname, '/assets/matrix.jpg')), 'matrix.jpg')
            .end((err,res) => {
                res.should.have.status(204);
                done();
            });
        });
    });
    describe('DELETE /:id', () => {
        it('should return 404 if the question doesnt exist', function(done) {
            chai
            .request(app)
            .delete('/questions/1024')
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
        it('should return 204 if the question has been deleted succesfully', function(done) {
            chai
            .request(app)
            .delete('/questions/3')
            .end((err, res) => {
                res.should.have.status(204);
                done();
            });
        });
    });
});