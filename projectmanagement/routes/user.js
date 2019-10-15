const keys = require('../keys');
const request = require("request");
const parser = require('xml2json');
const checkLogin = require('../functions/checkLogin');
const fs = require('fs');
const multer = require("multer");
const AWS = require('aws-sdk');
const removeprofilephoto = require('../functions/removeprofilephoto')
const updateSearchProviders = require('../functions/updatesearchproviders');
const updateAllProjects = require('../functions/updateallprojects')
const serverkeys = require('../../keys');
const s3 = new AWS.S3({
    accessKeyId: serverkeys.AWS_ACCESS_KEY,
    secretAccessKey: serverkeys.AWS_SECRET_ACCESS_KEY
});

module.exports = app => {
    const fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './routes/temp');
        },
        filename: (req, file, cb) => {
            let providerid = req.session.user.providerid;
            let access = req.session.user.access;
            let ext = "";
            if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
                ext = "jpg"
            }
            else if (file.mimetype === "image/png") {
                ext = "png"
            }
            cb(null, `${providerid}.${ext}`);
        }
    });
    const fileFilter = (req, file, cb) => {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg'
        ) {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    };
    app.use(multer({ fileFilter }).single('profilephoto'));

    app.post('/projectmanagement/loginuser', (req, res) => {

        // Store hash in your password DB.

        request.post({
                url: `${keys.secretapi}/login.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                if (body) {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    let response = parsedjson.response;

                    let providerid = "";
                    if (response.hasOwnProperty("valid")) {
                        providerid = response.valid;
                        req.session.user = { providerid: response.providerid }

                        res.redirect(`${keys.clientAPI}/${providerid}/myprojects`)
                    }
                    else {

                        res.redirect(`${keys.clientAPI}/providers/login/Invalid login please try again`)
                    }

                    //values returned from DB

                }

            }) // end request

    })

    app.post('/projectmanagement/reactnative/clientlogin', (req, res) => {

        // Store hash in your password DB
        request.post({
                url: `${keys.secretapi}/login.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                if (body) {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    let response = parsedjson.response;

                    let providerid = "";
                    if (response.hasOwnProperty("valid")) {
                        providerid = response.valid;
                        req.session.user = { providerid: response.providerid }
                        response = updateAllProjects(response)
                        res.send(response)
                    }
                    else {

                        res.send({ message: "Invalid Login" })
                    }

                    //values returned from DB

                }

            }) // end request

    })

    app.post('/projectmanagement/:providerid/joinmynetwork/commission', checkLogin, (req, res) => {
        let providerid = req.session.user.providerid;
        let commission = req.params.providerid;
        let values = { providerid, commission }
        request.post({
                url: `${keys.secretapi}/updatecommission.php`,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }

            },

            function(err, httpResponse, body) {
                if (!err) {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)

                    res.send(updateSearchProviders(parsedjson.response))
                }
                else {

                    err = JSON.parse(err)
                    res.send(err);
                }

            }) // end request



    })
    app.post('/projectmanagement/registernewuser', (req, res) => {

        request.post({
                url: `${keys.secretapi}/register.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                let providerid = "";
                if (body) {

                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    let response = parsedjson.response;
                    if (response.hasOwnProperty("providerid")) {
                        providerid = response.providerid;
                        req.session.user = { providerid }
                        res.redirect(`${keys.clientAPI}/${providerid}/myprojects`)
                    }
                    else {
                        res.redirect(`${keys.clientAPI}/providers/login/Invalid login please try again`)
                    }

                }

            }) // end request


    })
    app.post('/projectmanagement/registernewuser/async', (req, res) => {

        request.post({
                url: `${keys.secretapi}/register.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                let providerid = "";
                if (body) {

                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    let response = parsedjson.response;
                    if (response.hasOwnProperty("providerid")) {
                        providerid = response.providerid;
                        req.session.user = { providerid }

                    }
                    res.send(response)


                }
                else {
                    res.send({ message: 'Error Could Not make the request ' })
                }

            }) // end request


    })

    app.post('/projectmanagement/:providerid/updateuserpassword', checkLogin, (req, res) => {

        request.post({
                url: `${keys.secretapi}/updateuserpassword.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                if (!err) {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    res.send(parsedjson.response);
                    //values returned from DB

                }
                else {
                    res.send({ errorMessage: "Error, please try again " })
                }

            }) // end request


    })
    app.post('/projectmanagement/:providerid/updateuserprofile', checkLogin, (req, res) => {
        let values = req.body;
        if (req.hasOwnProperty("session")) {
            if (req.session.hasOwnProperty("user")) {
                values.providerid = req.session.user.providerid;
                values.access = req.session.user.access;
            }
        }

        request.post({
                url: `${keys.secretapi}/updateuserprofile.php`,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                if (!err) {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    req.session.user = parsedjson.response;

                    res.send(parsedjson.response);

                }

            }) // end request


    })

    app.post('/projectmanagement/updateclientregister', (req, res) => {
        let values = req.body
        let providerid = "";
        if (req.hasOwnProperty("session")) {
            if (req.session.hasOwnProperty("user")) {
                if (req.session.user.hasOwnProperty("providerid")) {
                    providerid = req.session.user.providerid;
                    values.providerid = providerid;
                }
            }
        };
        values.providerid = providerid;
        request.post({
                url: `${keys.secretapi}/updateuserprofile.php`,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                if (body) {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)

                    let response = parsedjson.response;
                    req.session.user = { providerid: response.providerid }

                    res.redirect(`${keys.clientAPI}/${response.providerid}/myprojects`)
                }
                else {

                    var message = encodeURIComponent("Error in Client Login ")
                    res.redirect(keys.clientAPI + "/login/" + message)

                }

            }) // end request

    })
    app.get("/projectmanagement/:providerid/checkproviderid", (req, res) => {

        const providerid = req.params.providerid;

        let values = { providerid }

        request.post({
                url: `${keys.secretapi}/checkproviderid.php`,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                if (!err) {
                    const json = parser.toJson(body);
                    const parsedjson = JSON.parse(json)
                    res.send(parsedjson.response)

                }

            }) // end request

    })

    app.get("/projectmanagement/:providerid/checkcommission", (req, res) => {

        const providerid = req.params.providerid;
        let values = { providerid }

        request.post({
                url: `${keys.secretapi}/checkcommission.php`,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                if (!err) {
                    const json = parser.toJson(body);
                    const parsedjson = JSON.parse(json)
                    res.send(parsedjson.response)

                }

            }) // end request

    })
    app.get("/projectmanagement/:projectid/checkprojectid", (req, res) => {

        const projectid = req.params.projectid;

        let values = { projectid }

        request.post({
                url: `${keys.secretapi}/checknewprojectid.php`,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                if (!err) {
                    const json = parser.toJson(body);
                    const parsedjson = JSON.parse(json)
                    res.send(parsedjson.response)

                }

            }) // end request

    })

    app.get("/projectmanagement/user/checkemailaddress/:emailaddress", (req, res) => {

        const emailaddress = req.params.emailaddress;
        let providerid = "";
        if (req.hasOwnProperty("session")) {
            if (req.session.hasOwnProperty("user")) {
                providerid = req.session.user.providerid;
            }
        }
        let values = { emailaddress, providerid }

        request.post({
                url: `${keys.secretapi}/checkemailaddress.php`,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                if (!err) {
                    const json = parser.toJson(body);
                    const parsedjson = JSON.parse(json)
                    res.send(parsedjson.response)

                }

            }) // end request

    })
    app.get("/projectmanagement/user/logout", (req, res) => {
        let providerid = "";
        if (req.hasOwnProperty("session")) {
            if (req.session.hasOwnProperty("user")) {
                if (req.session.user.hasOwnProperty("providerid")) {
                    providerid = req.session.user.providerid;
                }
            }
        }

        let values = { providerid }
        request.post({
                url: `${keys.secretapi}/logout.php`,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                if (!err) {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    req.session.destroy();
                    res.redirect(keys.clientAPI)

                }

            }) // end request

    })

    app.get("/projectmanagement/:providerid/logout", (req, res) => {
        let providerid = req.params.providerid;
        req.session.destroy();
        if (!req.session) {
            res.send({ logout: providerid })
        }
        else {
            res.send(req.session)
        }
        //let values = { providerid }
        //request.post({
        //        url: `${keys.secretapi}/logout.php`,
        //        form: values,
        //        headers: {
        //            'Content-Type': 'application/json',
        //            'Permission': `${keys.grantAuthorization}`
        //        }
        //    },
        //    function(err, httpResponse, body) {
        //        if (!err) {
        //            var json = parser.toJson(body);
        //            var parsedjson = JSON.parse(json)
        //            let response = parsedjson.response;
        //            res.send(response)
        //        }

        //    }) // end request

    })

    app.post("/projectmanagement/login", (req, res) => {
        res.send(req.body)
    })

    app.get('/projectmanagement/:providerid/nativefileupload', (req, res) => {

        res.send({ message: 'Hello React Native' })

    })

    app.post('/projectmanagement/:providerid/nativefileupload', (req, res) => {
        console.log(req.file)
        res.send({ message: 'Hello React Native' })
    })

    app.post("/projectmanagement/:providerid/uploadprofileimage", removeprofilephoto, (req, res) => {

        if (req.hasOwnProperty("file")) {

            let providerid = req.params.providerid;

            let ext = "";
            if (req.file.mimetype === "image/jpeg" || req.file.mimetype === "image/jpeg") {
                ext = "jpg";
            }
            else if (req.file.mimetype === "image/png") {
                ext = "png";
            }
            let fileName = `./routes/temp/${ providerid }.${ext}`;
            const S3_BUCKET = "goandhireme";
            var rand = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 5; i++)
                rand += possible.charAt(Math.floor(Math.random() * possible.length));

            //fs.readFile(fileName, (err, data) => {
            //if (err) throw err;
            const params = {
                Bucket: 'goandhireme', // pass your bucket name
                Key: `${rand}${providerid}.${ext}`, // file will be saved as testBucket/contacts.csv
                Body: req.file.buffer
            };
            s3.upload(params, function(s3Err, data) {
                if (s3Err) throw s3Err
                let values = { providerid, profileurl: data.Location }

                request.post({
                        url: `${keys.secretapi}/updateprofileurl.php`,
                        form: values,
                        headers: {
                            'Permission': `${keys.grantAuthorization}`
                        }
                    },
                    function(err, httpResponse, body) {
                        if (!err) {
                            var json = parser.toJson(body);
                            var parsedjson = JSON.parse(json)
                            res.send(parsedjson.response)

                        }

                    }) // end request               


            })
            //});
            //});




            //var formData = {
            //    providerid,
            //    access,
            //    my_file: fs.createReadStream(fileName),
            //};

            //request.post({
            //        url: `${keys.secretapi}/uploadprofilephoto.php`,
            //        formData,
            //        headers: {
            //            'Permission': `${keys.grantAuthorization}`
            //        }
            //    },
            //    function(err, httpResponse, body) {
            //        if (!err) {
            //            var json = parser.toJson(body);
            //            var parsedjson = JSON.parse(json)
            //            fs.unlink(fileName)
            //            res.send(parsedjson.response)


            //        }

            //    }) // end request

        }


    })
    app.get('/projectmanagement/checkuser', (req, res) => {
        if (req.hasOwnProperty("session")) {
            if (req.session.hasOwnProperty("user")) {

                if (req.session.user.hasOwnProperty("providerid")) {
                    let providerid = req.session.user.providerid;
                    let values = { providerid };
                    request.post({
                            url: `${keys.secretapi}/loadmyprojects.php`,
                            form: values,
                            headers: {
                                'Content-Type': 'application/json',
                                'Permission': `${keys.grantAuthorization}`
                            }
                        },
                        function(err, httpResponse, body) {
                            if (!err) {
                                let json = parser.toJson(body);
                                let parsedjson = JSON.parse(json);
                                let response = parsedjson.response;
                                response = updateAllProjects(response);
                                res.send(response);
                            }
                            else {

                                const errorMessage = "There was an error requesting the projects "
                                res.send({ errorMessage });
                            }

                        }) // end request

                }
                else {
                    res.send({ message: 'No User Logged In!' })
                }
            }
            else {
                res.send({ message: 'No User Logged In!' })
            }
        }
        else {
            res.send({ message: 'No User Logged In!' })
        }



    })

}
