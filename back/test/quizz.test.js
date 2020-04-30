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
});