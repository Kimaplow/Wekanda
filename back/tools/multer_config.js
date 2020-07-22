const multer = require('multer');

function uniqueName(filename) {
    let index = filename.indexOf(".");
    let rootFilename = filename.substr(0, index);
    return rootFilename + Date.now() + filename.substr(index);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/img');
    },
    filename: function (req, file, cb) {
        req.body.path_file = uniqueName(req.body.path_file);
        cb(null, req.body.path_file);
    }
});

const upload = multer({
    storage: storage
});

module.exports = upload;