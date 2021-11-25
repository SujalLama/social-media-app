const multer = require('multer');
const shortid = require('shortid');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file.fieldname);
        console.log(file.originalname);
        
        const dir = path.join(path.dirname(__dirname), `/files/${file.fieldname}`)
        console.log(!fs.existsSync(dir));
        if(!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }
        cb(null, dir)
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate() + '-' + file.originalname)
    }
})

function checkFileType(file, cb) {
    if(file.mimetype = "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        return cb(null, true)
    } else {
        throw new Error('Format not valid')
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
})

const multipleUpload = upload.fields([{name: 'avatar'}, {name: 'attachment'}])

const uploadArray = multer({storage}).array('files');

module.exports = {multipleUpload, uploadArray, upload};
