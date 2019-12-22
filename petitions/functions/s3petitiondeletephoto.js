const serverkeys = require('../../keys');
const AWS = require('aws-sdk');
const getImageKeys = require("./getimagekeys");
const s3 = new AWS.S3({
    accessKeyId: serverkeys.AWS_ACCESS_KEY,
    secretAccessKey: serverkeys.AWS_SECRET_ACCESS_KEY
});
module.exports = (req, res, next) => {
    let imageid = req.params.imageid;

    let myuser = req.body.myuser;

    let imagekeys = getImageKeys(myuser, imageid);
    let Key = false;
    let i = false;
    let j = false;
    let k = false;
    let l = false;
    if (imagekeys.length === 4) {
        i = imagekeys[0];
        j = imagekeys[1];
        k = imagekeys[2];
        l = imagekeys[3];
        Key = myuser.petitions.petition[i].conflicts.conflict[j].arguements.arguement[k].images.image[l].image;
        let keypos = Key.lastIndexOf('/');
        Key = Key.substr(keypos + 1);

    }
    else if (imagekeys.length === 3) {
        i = imagekeys[0];
        j = imagekeys[1];
        k = imagekeys[2];
        Key = myuser.petitions.petition[i].conflicts.conflict[j].images.image[k].image;
        let keypos = Key.lastIndexOf('/');
        Key = Key.substr(keypos + 1);
    }

    var params = {
        Bucket: "civilengineer-io",
        Key
    };
    console.log("DELETE", params)
    s3.deleteObject(params, function(s3Err, data) {
        if (s3Err) throw s3Err
        let imagekeys = getImageKeys(myuser, imageid)
        let i = false;
        let j = false;
        let k = false;
        let l = false;

        if (imagekeys.length === 4) {
            i = imagekeys[0];
            j = imagekeys[1];
            k = imagekeys[2];
            l = imagekeys[3];
            myuser.petitions.petition[i].conflicts.conflict[j].arguements.arguement[k].images.image.splice(l, 1)
            let myimages = myuser.petitions.petition[i].conflicts.conflict[j].arguements.arguement[k].images.image;

            if (myimages.length === 0) {
                delete myuser.petitions.petition[i].conflicts.conflict[j].arguements.arguement[k].images.image;
                delete myuser.petitions.petition[i].conflicts.conflict[j].arguements.arguement[k].images;

            }
            req.body.myuser = myuser;
            next();


        }
        else if (imagekeys.length === 3) {

            i = imagekeys[0];
            j = imagekeys[1];
            k = imagekeys[2];

            myuser.petitions.petition[i].conflicts.conflict[j].images.image.splice(k, 1)
            let myimages = myuser.petitions.petition[i].conflicts.conflict[j].images.image;

            if (myimages.length === 0) {
                delete myuser.petitions.petition[i].conflicts.conflict[j].images.image;
                delete myuser.petitions.petition[i].conflicts.conflict[j].images;

            }
            req.body.myuser = myuser;

            next();
        }



    });


}
