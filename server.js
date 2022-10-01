const express = require('express');
const path = require('path');
var data = require('./store');
const app = express();

app.use(express.static('./templates'));
app.set('view engine', 'ejs');
app.set('views', './templates');
const { v4: uuid } = require("uuid");

const { response } = require('express');
const AWS = require('aws-sdk');

// config upload
const multer = require('multer');

// const upload = multer();

const storage = multer.memoryStorage({
    destination(req, file, callback) {
        callback(null, '');
    },
});

function checkFileType(file, cb) {
    const fileTypes = /jpeg|jpg|png|gif/;

    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const minetype = fileTypes.test(file.minetype);
    if (extname && minetype) {
        return cb(null, true);
    }
    return cb("Error: Image Only");
}

const upload = multer({
    storage,
    limits: { fileSize: 2000000 }, //2MB
    fileFilter(req, file, cb) {
        checkFileType(file, cb);
    },
});

const CLOUD_FRONT_URL = 'https://d32lwg2gxxzwp5.cloudfront.net';

app.post('/', upload.single('image'), (req, res) => {
    const { ma_sp, ten_sp, so_luong, loai } = req.body;
    const image = req.file.originalname.split(".");

    const fileType = image[image.length - 1];

    const filePath = `${uuid() + Date.now().toString()}.${fileType}`;
    const params = {
        Bucket: "thuchanh-cnm-06",
        Key: filepath,
        Body: req.file.buffer
    }
});

s3.upload(params, (error, data) => {
    if (error) {
        console.log('error = ', error);
        return res.send('Internal Server Error');
    } else {
        TableName: tableName,
        Item: {
            "ma_sp": ma_sp,
            "ten_sp": ten_sp,
            "so_luong": so_luong,
            "image_url": `${CLOUD_FRONT_URL}${filePath}`
        }
    }
    docClient.put(newItem, (err, data) => {
        if (err) {
            console.log('error = ', error);
            return res.send('Internal Server Error');

        } else {
            return res.redirect("/");
        }
    });
});

//------------------------------------------------------------------------------------------------------------------

const config = new AWS.Config({
    accessKeyId: 'AKIA23D4LIXFC2FWXN6W',
    secretAccessKey: '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',
    region: 'us-east-1'
})

AWS.config = config;

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = 'SanPham';


app.get('/', (req, res) => {
    const params = {
        TableName: tableName,
    };
    docClient.scan(params, (err, data) => {
        if (err) {
            res.send('Internal Server Error');
        } else {
            return res.render('node', { SanPhams: data.Items });
        }
    });
})

app.post('/', upload.fields([]), (req, res) => {
    const { ma_sp, ten_sp, so_luong, loai } = req.body;

    const params = {
        TableName: tableName,
        Item: {
            "ma_sp": ma_sp,
            "ten_sp": ten_sp,
            "so_luong": so_luong,
            "loai": loai,
        }
    }

    docClient.put(params, (err, data) => {
        if (err)
            return res.send('Internal Server Error');
        else
            return res.redirect("/");
    });

    return res.redirect("/");
});
app.get('/delete', (req, res) => {
    const id = req.query.id;
    console.log(id);
    data = data.filter(text => {
        console.log(text);
        return text.ma_sp !== id;
    });
    return res.render('node', { data: data });
});

app.listen(3000, () => {
    console.log("Server start");
})