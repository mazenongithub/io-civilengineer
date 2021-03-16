  const serverkeys = require('../../keys');
  const AWS = require('aws-sdk');
  const s3 = new AWS.S3({
      accessKeyId: serverkeys.AWS_ACCESS_KEY,
      secretAccessKey: serverkeys.AWS_SECRET_ACCESS_KEY
  });

  module.exports = (req, res, next) => {
    
   
      if (req.hasOwnProperty("file")) {

          let ext = "";
          if (req.file.mimetype === "image/jpeg" || req.file.mimetype === "image/jpeg") {
              ext = "jpg";
          }
          else if (req.file.mimetype === "image/png") {
              ext = "png";
          }

          const S3_BUCKET = "civilengineer-io";
          var rand = "";
          var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
          for (var i = 0; i < 5; i++) {
              rand += possible.charAt(Math.floor(Math.random() * possible.length));
          }

          const params = {
              Bucket: S3_BUCKET, // pass your bucket name
              Key: `${rand}${myuser.providerid}.${ext}`, // file will be saved as testBucket/contacts.csv
              Body: req.file.buffer
          };
          s3.upload(params, function(s3Err, data) {
              if (s3Err) throw s3Err
              if (data.hasOwnProperty("Location")) {

                  let image = data.Location;
                  myuser.profileurl = image;
                  req.body.myuser = myuser;
                  next();
              }
          })



      }
      else {
          next();
      }

  }
  