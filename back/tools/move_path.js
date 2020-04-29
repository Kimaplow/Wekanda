const multer = require('multer');

function moveToPath(file) {
    console.log("=== MOVE TO PATH ===");
    console.log('file : ' + file);
    console.log('filetype : ' + file.mimetype);

    let type = file.mimetype.split('/');
    console.log('type : ' + type[0]);
    
    if(type[0] === 'image') {
        file.mv(('../public/img/' + file.name));
        return true;
    } else if (type[0] === 'video') {
        file.mv(('../public/video/' + file.name));
        return true;
    }
    return false;
    
}

module.exports = moveToPath;
