const serverkeys = require('../../keys');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: serverkeys.AWS_ACCESS_KEY,
    secretAccessKey: serverkeys.AWS_SECRET_ACCESS_KEY
});

module.exports = (req, res, next) => {

    let providerid = req.params.providerid;
    let myuser = req.body.myuser;
    myuser = JSON.parse(myuser);
    const profileurl = myuser.profileurl;
    if(profileurl) {
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

} else {
    next();
}
}
