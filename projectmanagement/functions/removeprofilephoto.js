var request = require("request");
const parser = require('xml2json');
const serverkeys = require('../../keys');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: serverkeys.AWS_ACCESS_KEY,
    secretAccessKey: serverkeys.AWS_SECRET_ACCESS_KEY
});

module.exports = (req, res, next) => {
    console.log(req.body, req.file)
    let providerid = req.params.providerid;
    console.log(providerid, req.body)
    let myuser = req.body.myuser;
    console.log(myuser)
    myuser = JSON.parse(myuser);
    const profileurl = myuser.profileurl;
    const keypos = profileurl.lastIndexOf('/');
    const Key = profileurl.substr(keypos + 1);

    var params = {
        Bucket: "civilengineer-io",
        Key
    };

    s3.deleteObject(params, function(err, data) {
        if (err) {
            console.log(err)
            next(); // an error occurred
        }
        else {
            console.log(data)
            next();
        }
    });

}
