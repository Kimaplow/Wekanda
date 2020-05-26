const pool = require('../data/pg.js');
const passport = require("passport");
const passportJWT = require("passport-jwt");

const cfg = require("./config.js");

const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const params = {
    secretOrKey: cfg.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

module.exports = function () {
    const strategy = new Strategy(params, async function(payload, done) {
        const result = await pool.query("select * from users where id_user=$1",[payload.id]);
        const user = result.rows[0] || null;
        if (user) {
            return done(null, {
                id: user.id_user,
            });
        } else {
            return done(new Error("User not found"), null);
        }
    });
    passport.use(strategy);
    return {
        initialize: function () {
            return passport.initialize();
        },
        authenticate: function () {
            return passport.authenticate("jwt", cfg.jwtSession);
        }
    };
};