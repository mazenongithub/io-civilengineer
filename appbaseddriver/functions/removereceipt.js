  const serverkeys = require('../../keys');
  const AWS = require('aws-sdk');
  const AppBasedDriver = require("./appbaseddriver");

  const s3 = new AWS.S3({
    accessKeyId: serverkeys.AWS_ACCESS_KEY,
    secretAccessKey: serverkeys.AWS_SECRET_ACCESS_KEY
  });

  module.exports = (req, res, next) => {
    console.log(req.body)

    let myuser = req.body.myuser;
    const equipmentid = req.body.equipmentid;
    const costid = req.body.costid;
    const imageid = req.body.imageid;


    const appbaseddriver = new AppBasedDriver();

    const image = appbaseddriver.getImage(myuser, equipmentid, costid, imageid)

    if (image) {

      const keypos = image.url.lastIndexOf('/');
      const Key = image.url.substr(keypos + 1);

      const params = {
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
          const i = appbaseddriver.getEquipmentKey(myuser, equipmentid);
          const j = appbaseddriver.getCostKey(myuser, equipmentid, costid)
          const k = appbaseddriver.getImageKey(myuser, equipmentid, costid, imageid)
          myuser.equipment[i].costs[j].images.splice(k, 1)
          req.body.myuser = myuser;
          next();
        }
      });

    }

    else {
      next();
    }


  }
  