const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const BhavGeetData = require('../models/bhavgeet.model');


const algorithm = 'aes-128-cbc';
const key = Buffer.from("ZLDXDo2Bc4VPrWht", 'latin1');
const iv = Buffer.from("q2u5ilxHSGYzPm5o", 'latin1');

function encryptnew(text) {
    let cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('base64');
}

function decryptnew(text) {
    let encryptedText = Buffer.from(text, 'base64');
    let decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted;
}

exports.getbhavgeet = async (req, res) => {

    try {
        var bhavgeet = await BhavGeetData.findOne({ bhavgeetCode: req.params.bhavgeetCode });
        if(bhavgeet == null || bhavgeet == undefined || bhavgeet == {}){
            res.json({
                status : "failure",
                status_code : 404,
                message : "bhavgeet not found"
            });
        }else{
            var bhavgeet_path = path.join(__dirname, '..', 'public/bhavgeet/' + bhavgeet.bhavgeetCode +'.ery');
            console.log("path = " + bhavgeet_path);
            if(fs.existsSync(bhavgeet_path)){
                const inputData = fs.readFileSync(bhavgeet_path);
                // var cipherText = encryptnew(inputData);
                bhavgeet.file = inputData;
                var output = {};
                output.status = "success";
                output.status_code = "200";
                output.data = {};
                output.data.bhavgeet = bhavgeet;
                res.json(output);
            }else{
                res.json({
                    status : "failure",
                    status_code : 500,
                    message : "bhavgeet coming soon"
                });
            }
            
        }
        
    } catch (error) {
        var output = {};
        output.status = error.message;
        output.status_code = "500";
        console.log('error', error.message, error.stack)
        res.json(output);
    }
};
