const express = require('express');
const app = express();


app.use(express.static('public'));

const path = require('path');
const mime = require('mime-types');
const multer = require('multer');

const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});


const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images are allowed!'), false);
    }
};


const upload = multer({
    storage: fileStorage,
    fileFilter: fileFilter
});




app.post('/uploads', upload.single('myFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded or file type is not allowed.');
    }
    console.log(req.file);
    req.file.mimetype = mime.lookup(req.file.originalname);
    res.sendFile(path.join(__dirname, 'file-uploaded.html'));
});

app.get('/file-upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'file-upload.html'));
});

app.listen(3019, () => {
    console.log('Server is running on http://localhost:3011');
});
