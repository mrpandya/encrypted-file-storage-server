const express = require('express');
// const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
// const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require("fs");

update_app = express();
app = express();
dotenv.config();

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require("./routes/bhavgeet.routes")(app);

app.get('/upload', (req, res) => {
    res.render('fileupload');
});

// var file_storage = multer.diskStorage({
//     destination: function (req, file, cb) {

//         // Uploads is the Upload_folder_name 
//         cb(null, "files")
//     },
//     filename: function (req, file, cb) {
//         var csvfilename = file.originalname;
//         cb(null, csvfilename);
//     }
// });

// var file_upload = multer({
//     storage: file_storage,
//     fileFilter: function (req, file, cb) {
//         return cb(null, true);
//     }

// }).single("mysheet");

// app.post('/fileupload', (req, res, next) => {
//     file_upload(req, res, (err) => {
//         if (err) {
//             res.send(err);
//         } else {
//             fs.createReadStream('files/' + req.file.originalname)
//                 .on('end', () => {
//                     console.log('file successfully processed');
//                     res.send('File successfully uploaded');
//                 });
//         }
//     });
// });

const algorithm = 'aes-128-cbc';
const key = Buffer.from("ZLDXDo2Bc4VPrWht", 'latin1');
const iv = Buffer.from("q2u5ilxHSGYzPm5o", 'latin1');
var filename;
function encryptnew(text) {
    let cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('base64');
}

var file_storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Uploads is the Upload_folder_name 
        cb(null, "public/files")
    },
    filename: function (req, file, cb) {
        var filename = file.originalname;
        filename = file.originalname;
        cb(null, filename);
    }
});

var file_upload = multer({
    storage: file_storage,
    fileFilter: function (req, file, cb) {
        return cb(null, true);
    }
}).single("myfile");

app.post('/upload/file', (req, res) => {
    file_upload(req, res, (err) => {
        if (err) {
            res.send(err);
        } else {
            var file_path = path.join(__dirname, 'public/temp/' + filename);
            if (fs.existsSync(file_path)) {
                const inputData = fs.readFileSync(file_path);
                var cipherText = encryptnew(inputData);
                var encrypted_file_path = path.join(__dirname, 'public/files/' + req.body.filename + '.ery');
                try {
                    const data = fs.writeFileSync(encrypted_file_path, cipherText);
                    fs.unlinkSync(file_path);
                } catch (e) {
                    console.error(e);
                }
                var output = {};
                output.status = "success";
                output.status_code = "200";
                res.json(output);
            } else {
                res.json({
                    status: "failure",
                    status_code: 500,
                    message: "bhavgeet coming soon"
                });
            }
        }
    });
});



app.all('*', (req, res, next) => {

    var output = {};
    output.status = `Can't find ${req.originalUrl} on this server!`
    output.status_code = "404";
    res.json(output);

});

app.listen(process.env.PORT || 3000, () => console.log('server started'));