module.exports = {
    jwtSecret: process.env.jwtSecret || "MyS3cr3tK3y",
    jwtSession: {
        session: false
    },
    expiration : process.env.expiration || "4 weeks", // Format need to be expressed in seconds or as zeit/ms format
    saltRounds: 10
}
