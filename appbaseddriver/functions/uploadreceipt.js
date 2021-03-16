  const serverkeys = require('../../keys');
  const AWS = require('aws-sdk');
  const appbaseddriver = require('./functions/appbaseddriver')
  const s3 = new AWS.S3({
    accessKeyId: serverkeys.AWS_ACCESS_KEY,
    secretAccessKey: serverkeys.AWS_SECRET_ACCESS_KEY
  });

  module.exports = (req, res, next) => {

    let myuser = req.body.myuser;
    myuser = JSON.parse(myuser);

    let equipmentid = req.body.equipmentid;
    equipmentid = JSON.parse(equipmentid);

    let costid = req.body.equipmentid;
    costid = JSON.parse(costid);

    let imageid = req.body.imageid;
    imageid = JSON.parse(imageid);

    console.log(equipmentid, costid, imageid, myuser)

    if (req.hasOwnProperty("file")) {

      let ext = "";
      if (req.file.mimetype === "image/jpeg" || req.file.mimetype === "image/jpeg") {
        ext = "jpg";
      }
      else if (req.file.mimetype === "image/png") {
        ext = "png";
      }

      let rand = appbaseddriver.makeID(4);

      const S3_BUCKET = "civilengineer-io";

      const params = {
        Bucket: S3_BUCKET, // pass your bucket name
        Key: `${rand}${imageid}.${ext}`, // file will be saved as testBucket/contacts.csv
        Body: req.file.buffer
      };
      console.log(params)
      // s3.upload(params, function(s3Err, data) {
      //   if (s3Err) throw s3Err
      //   if (data.hasOwnProperty("Location")) {

      //     let image = data.Location;
      //     myuser.profileurl = image;
      //     req.body.myuser = myuser;
      //     next();
      //   }
      // })

      next();

    }
    else {
      next();
    }

  }
  