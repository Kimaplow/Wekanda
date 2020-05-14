const chai = require('chai');
const should = require('chai').should();
const chaiHttp = require('chai-http');
const app = require('../app');
const fs = require('fs');
const path = require('path');

chai.use(chaiHttp);

describe('Quizzes', () => {
    describe('GET /quizzes', () => {
        it('should return an array of all the quizzes', function (done) {
            chai
                .request(app)
                .get("/quizzes")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });
    describe('GET /quizzes/:id', () => {
        it('should return 404 with an id not existing', function (done) {
            chai
                .request(app)
                .get("/quizzes/9999")
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
        it('should return 500 with an input who is not a number', function (done) {
            chai
                .request(app)
                .get("/quizzes/toto")
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
        it('should return 200 with an existring entry (/1)', function (done) {
            chai.request(app)
                .get("/quizzes/1")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id_creator');
                    res.body.should.have.property('id_quizz');
                    res.body.should.have.property('title');
                    res.body.should.have.property('path_file');
                    res.body.should.have.property('difficulty');
                    done();
                });
        });
    });
    describe('GET /withtags', () => {
        it('should return 200 and all quizzes with their tags', function (done) {
            chai
                .request(app)
                .get('/quizzes/withtags')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.forEach(res => {
                        res.should.be.a('object');
                        res.should.have.property('id_creator');
                        res.should.have.property('id_quizz');
                        res.should.have.property('title');
                        res.should.have.property('path_file');
                        res.should.have.property('difficulty');
                        res.should.have.property('tags');
                    });
                    done();
                });
        });
    });
    describe('GET /withtags/:tag', () => {
        it('should return 404 if the tag does not exist or not given properly', function (done) {
            chai
                .request(app)
                .get('/quizzes/withtags/errortag')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
        it('should return 200 and all quizzes for the given tag', function (done) {
            chai
                .request(app)
                .get('/quizzes/withtags/Animaux')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.forEach(res => {
                        res.should.be.a('object');
                        res.should.have.property('id_creator');
                        res.should.have.property('id_quizz');
                        res.should.have.property('title');
                        res.should.have.property('path_file');
                        res.should.have.property('difficulty');
                        res.should.have.property('tag');
                    });
                    done();
                });
        });
    });
    describe('GET /:id/fromuser', () => {
        it('should return 404 if a user has not created any quizz', function (done) {
            chai
                .request(app)
                .get('/quizzes/5/fromuser')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
        it('should return 404 if a user does not exist or the input is wrong', function (done) {
            chai
                .request(app)
                .get('/quizzes/1024/fromuser')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
        it('should return 200 and the quizzes created if a user has created one nor some', function (done) {
            chai
                .request(app)
                .get('/quizzes/1/fromuser')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.forEach(res => {
                        res.should.be.a('object');
                        res.should.have.property('id_creator');
                        res.should.have.property('id_quizz');
                        res.should.have.property('title');
                        res.should.have.property('path_file');
                        res.should.have.property('difficulty');
                    });
                    done();
                });
        });
    });
    describe('GET /:id/questions', () => {
        it('should return 404 if the quizz does not exist', function (done) {
            chai
                .request(app)
                .get('/quizzes/2042/questions')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
        it('should return 200 and the questions if the quizz exists', function (done) {
            chai
                .request(app)
                .get('/quizzes/1/questions')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.forEach(res => {
                        res.should.be.a('object');
                        res.should.have.property('id_question');
                        res.should.have.property('id_quizz');
                        res.should.have.property('id_quizz').equal(1);
                        res.should.have.property('question');
                        res.should.have.property('path_file');
                    });
                    done();
                });
        });
    });
    describe('POST /', () => {
        it('should return 201 with good infos', function (done) {
            this.timeout(10000); // 10s timeout in order to give the image some time tu upload
            chai
                .request(app)
                .post('/quizzes/')
                .field('id_creator', 1)
                .field('title', 'Matrix')
                .field('path_file', 'matrix.jpg')
                .field('difficulty', 2)
                .attach('file', fs.readFileSync(path.join(__dirname, '/assets/matrix.jpg')), 'matrix.jpg')
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });
    });
    describe('DELETE /:id', () => {
        it('should return 404 if the quizz doesn\'t exist and therefore can\'t be deleted', function (done) {
            chai
                .request(app)
                .delete('/quizzes/1024/delete')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
        it('should return 204 if deleted successfully', function (done) {
            chai
                .request(app)
                .delete('/quizzes/2/delete')
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
    });
    describe('PATCH /:id', () => {
        it('should return 204 if we try to modify both the path_file and add a new image', function (done) {
            chai
                .request(app)
                .patch('/quizzes/1')
                .field('path_file', 'matrix.jpg')
                .attach('file', fs.readFileSync(path.join(__dirname, '/assets/matrix.jpg')), 'matrix.jpg')
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
        it('should return 404 if the quizz doesn\'t exist and therefore can\'t be patched', function (done) {
            chai
                .request(app)
                .patch('/quizzes/1024')
                .field('title', 'Totoro')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
        it('should return 204 and patch title', function (done) {
            chai
                .request(app)
                .patch('/quizzes/1')
                .field('title', "les animaux d''afrique")
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
        it('should return 204 and patch difficulty', function (done) {
            chai
                .request(app)
                .patch('/quizzes/1')
                .field('difficulty', 3)
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
        it('should return 500 if we try to modify the path_file  without a new fille associated', function (done) {
            chai
                .request(app)
                .patch('/quizzes/1')
                .field('path_file', 'test.jpg')
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
        it('should return 204 if we try to modify all infos of a quizz but also the image', function (done) {
            chai
                .request(app)
                .patch('/quizzes/4')
                .field('title', 'Matrix')
                .field('difficulty', 2)
                .field('id_creator', 1)
                .field('path_file', 'matrix.jpg')
                .attach('file', fs.readFileSync(path.join(__dirname, '/assets/matrix.jpg')), 'matrix.jpg')
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
        it('should return 500 if we try to modify the path_file and another field without a new fille associated', function (done) {
            chai
                .request(app)
                .patch('/quizzes/1')
                .field('path_file', 'test.jpg')
                .field('title', 'Matrix')
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
       
    });
});