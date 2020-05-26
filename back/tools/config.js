module.exports = {
    jwtSecret: process.env.jwtSecret || "MyS3cr3tK3y",
    jwtSession: {
        session: false
    },
    saltRounds: 10
}
