const serverkeys = require('../../keys');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: serverkeys.AWS_ACCESS_KEY,
    secretAccessKey: serverkeys.AWS_SECRET_ACCESS_KEY
});

module.exports = (req, res, next) => {
   let myuser = req.body.myuser;
   myuser = JSON.parse(myuser);
   
   if(req.hasOwnProperty("file") && myuser.profileurl) {
         
            let keypos = myuser.profileurl.lastIndexOf('/');
            let Key =myuser.profileurl.substr(keypos + 1);
            var params = {
                Bucket: "civilengineer-io",
                Key
            };

                            s3.deleteObject(params, function(err, data) {
                                if (err) {

                                    next(); // an error occurred
                                }
                                else {

                                    next();
                                }
                            });
   }


}
