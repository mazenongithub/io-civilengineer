  const serverkeys = require('../../keys');
  const AWS = require('aws-sdk');
  const AppBasedDriver = require("./appbaseddriver");

  const s3 = new AWS.S3({
    accessKeyId: serverkeys.AWS_ACCESS_KEY,
    secretAccessKey: serverkeys.AWS_SECRET_ACCESS_KEY
  });

  module.exports = (req, res, next) => {



    let myuser = req.body.myuser;
    myuser = JSON.parse(myuser);
    let values = req.body.values;
    values = JSON.parse(values)
    const equipmentid = values.equipmentid;
    const costid = values.costid;
    const imageid = values.imageid;
    const appbaseddriver = new AppBasedDriver();






    const i = appbaseddriver.getEquipmentKey(myuser, equipmentid);
    const j = appbaseddriver.getCostKey(myuser, equipmentid, costid)
    const k = appbaseddriver.getImageKey(myuser, equipmentid, costid, imageid)

    console.log(i, j, k)

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
      s3.upload(params, function(s3Err, data) {

        if (s3Err) throw s3Err

        if (data) {

          myuser.equipment[i].costs[j].images[k].url = data.Location

          req.body.myuser = myuser;
          next();
        }

      })


    }
    else {
      next();
    }


  }
  