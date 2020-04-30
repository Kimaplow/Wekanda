const chai = require('chai');
const should = require('chai').should();
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);

describe('Quizzes', () => {
    describe('GET /quizzes', () => {
        it('should return an array of all the quizzes', (done) => {
            chai
            .request(app)
            .get("/quizzes")
            .end((err,res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
        });
    });
    describe('GET /quizzes/:id', () => {
        it('should return 404 with an id not existing', (done) => {
            chai
            .request(app)
            .get("/quizzes/9999")
            .end((err,res) => {
                res.should.have.status(404);
                done();
            });
        });
        it('should return 500 with an input who is not a number', (done) => {
            chai
            .request(app)
            .get("/quizzes/toto")
            .end((err,res) => {
                res.should.have.status(500);
                done();
            });
        });
    });
});