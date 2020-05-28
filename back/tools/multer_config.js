const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(req.file);
        cb(null, './public/img');
    },
    filename: function (req, file, cb) {
        console.log(req.body.path_file);
        cb(null, req.body.path_file);
    }
});

const upload = multer({
    storage: storage
});

module.exports = upload;