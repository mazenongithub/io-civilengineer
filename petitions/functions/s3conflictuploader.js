const serverkeys = require('../../keys');
const AWS = require('aws-sdk');
const getConflictKeys = require('./getconflictkeys');
const makeID = require('./makeid')
const s3 = new AWS.S3({
    accessKeyId: serverkeys.AWS_ACCESS_KEY,
    secretAccessKey: serverkeys.AWS_SECRET_ACCESS_KEY
});

module.exports = (req, res, next) => {

    if (req.hasOwnProperty("file")) {

        let imageid = makeID(16)


        let ext = "";
        if (req.file.mimetype === "image/jpeg" || req.file.mimetype === "image/jpeg") {
            ext = "jpg";
        }
        else if (req.file.mimetype === "image/png") {
            ext = "png";
        }
        let fileName = `./routes/temp/${imageid}.${ext}`;
        const S3_BUCKET = "civilengineer-io";
        var rand = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (var i = 0; i < 5; i++)
            rand += possible.charAt(Math.floor(Math.random() * possible.length));

        const params = {
            Bucket: S3_BUCKET, // pass your bucket name
            Key: `${rand}${imageid}.${ext}`, // file will be saved as testBucket/contacts.csv
            Body: req.file.buffer
        };
        s3.upload(params, function(s3Err, data) {
            if (s3Err) throw s3Err
            if (data.hasOwnProperty("Location")) {
                let myuser = req.body.myuser;
                myuser = JSON.parse(myuser);

                let image = data.Location;
                let newImage = { imageid, image }
                let conflictid = req.params.conflictid;
                let keys = getConflictKeys(myuser, conflictid);
                let i = keys[0];
                let j = keys[1];


                let conflict = myuser.petitions.petition[i].conflicts.conflict[j];
                if (conflict.hasOwnProperty("images")) {
                    myuser.petitions.petition[i].conflicts.conflict[j].images.image.push(newImage)

                }
                else {
                    let images = { image: [newImage] }
                    myuser.petitions.petition[i].conflicts.conflict[j].images = images;

                }



                req.body.myuser = myuser;
                next();
            }
        })



    }
    else {
        next();
    }


}
