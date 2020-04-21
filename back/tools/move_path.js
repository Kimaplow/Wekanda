function moveToPath(file) {
    const type = file.type.split('/');
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
