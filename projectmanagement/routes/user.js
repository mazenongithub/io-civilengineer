const keys = require('../keys');
const request = require("request");
const parser = require('xml2json');
const checkLogin = require('../functions/checkLogin');
const fs = require('fs');
const multer = require("multer");
const AWS = require('aws-sdk');
const removeprofilephoto = require('../functions/removeprofilephoto')
const updateSearchProviders = require('../functions/updatesearchproviders');
const updateAllProjects = require('../functions/updateallprojects');
const updateAllUsers = require('../../construction/functions/updateallusers');
const serverkeys = require('../../keys');
const uploadprofileimage = require('../functions/uploadprofileimage');
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

    app.post('/projectmanagement/webclient/loginuser', (req, res) => {
        const { clientid, client, firstname, lastname, emailaddress, phonenumber, profileurl } = req.body;
        const values = { clientid, client, firstname, lastname, emailaddress, phonenumber, profileurl };
        request.post({
                url: `${keys.secretAPI}/loginclient.php`,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                try {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    let response = parsedjson.response;

                    let providerid = "";
                    if (response.hasOwnProperty("valid")) {

                        providerid = response.valid;
                        req.session.user = { providerid: response.providerid }

                        res.redirect(`${keys.clientAPI}/${providerid}/myprojects`)

                    }

                    else if (response.hasOwnProperty("newuser")) {
                        providerid = response.newuser;
                        req.session.user = { providerid: response.providerid }
                        res.redirect(`${keys.clientAPI}/providers/register`)
                    }
                    else {

                        res.redirect(`${keys.clientAPI}/providers/login/Invalid login please try again`)
                    }

                }
                catch (err) {
                    res.redirect(`${keys.clientAPI}/providers/login/Invalid login please try again`)
                }

                //values returned from DB


            }) // end request
        // Store hash in your password DB.




    })

    app.post('/projectmanagement/clientlogin', (req, res) => {
        console.log(req.body)
        request.post({
                url: `https://civilengineer.io/projectmanagement/api/loginclient.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                try {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    let response = parsedjson.response;
                    if (response.hasOwnProperty("providerid")) {
                        let user = { providerid: response.providerid }
                        req.session.user = user;
                        response = updateAllProjects(response);
                        res.send(response)
                    }
                    else {
                        res.send(response)
                    }


                }
                catch (err) {
                    res.status(404).send({ message: 'Server is Down please try again later ' })
                }

                //values returned from DB


            }) // end request
        // Store hash in your password DB.




    })



    app.post('/projectmanagement/loginuser', (req, res) => {
        console.log(req.body)
        // Store hash in your password DB.

        request.post({
                url: `https://civilengineer.io/projectmanagement/api/login.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {

                try {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    let response = parsedjson.response;
                    if (response.hasOwnProperty("providerid")) {
                        let user = { providerid: response.providerid }
                        req.session.user = user;
                        response = updateAllProjects(response);
                        res.send(response)
                    }
                    else {
                        res.send(response)
                    }


                }
                catch (err) {
                    res.status(404).send({ message: 'Server is Down please try again later ' })
                }

            }) // end request

    })

    app.post('/projectmanagement/reactnative/clientlogin', (req, res) => {

        // Store hash in your password DB
        request.post({
                url: `${keys.secretAPI}/login.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                try {
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
                catch (err) {
                    res.status(404).send({ message: 'API failure could not load response' })
                }

            }) // end request

    })

    app.post('/projectmanagement/:providerid/joinmynetwork/commission', checkLogin, (req, res) => {
        let providerid = req.session.user.providerid;
        let commission = req.params.providerid;
        let values = { providerid, commission }
        request.post({
                url: `${keys.secretAPI}/updatecommission.php`,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }

            },

            function(err, httpResponse, body) {

                try {

                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)

                    res.send(updateSearchProviders(parsedjson.response))
                }
                catch (err) {

                    err = JSON.parse(err)
                    res.send(err);
                }

            }) // end request



    })

    app.post('/projectmanagement/registernewuser', (req, res) => {
        console.log(req.body)
        request.post({
                url: `https://civilengineer.io/projectmanagement/api/register.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                try {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    let response = parsedjson.response;
                    if (response.hasOwnProperty("providerid")) {
                        let user = { providerid: response.providerid }
                        req.session.user = user;
                        response = updateAllProjects(response);
                        res.send(response)
                    }
                    else {
                        res.send(response)
                    }


                }
                catch (err) {
                    res.status(404).send({ message: 'Server is Down please try again later ' })
                }


            })

    })

    app.post('/projectmanagement/registernewuser/async', (req, res) => {

        request.post({
                url: `${keys.secretAPI}/register.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                let providerid = "";
                try {

                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    let response = parsedjson.response;
                    if (response.hasOwnProperty("providerid")) {
                        providerid = response.providerid;
                        req.session.user = { providerid }

                    }
                    res.send(response)


                }
                catch (err) {
                    res.status(404).send({ message: 'API failure could not load response ' })
                }

            }) // end request


    })


    app.post('/projectmanagement/:providerid/updateuserpassword', checkLogin, (req, res) => {

        request.post({
                url: `${keys.secretAPI}/updateuserpassword.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                try {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    res.send(parsedjson.response);
                    //values returned from DB

                }
                catch (err) {
                    res.status.send({ message: "API failure, could not load response " })
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
                url: `${keys.secretAPI}/updateuserprofile.php`,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                try {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    req.session.user = parsedjson.response;

                    res.send(parsedjson.response);

                }
                catch (err) {
                    res.status(404).send({ message: 'API failure could not load response' })
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
                url: `${keys.secretAPI}/updateuserprofile.php`,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                try {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)

                    let response = parsedjson.response;
                    req.session.user = { providerid: response.providerid }

                    res.redirect(`${keys.clientAPI}/${response.providerid}/myprojects`)
                }
                catch (err) {

                    var message = encodeURIComponent("Error in Client Login ")
                    res.redirect(keys.clientAPI + "/login/" + message)

                }

            }) // end request

    })
    app.get("/projectmanagement/:providerid/checkproviderid", (req, res) => {

        const providerid = req.params.providerid;

        let values = { providerid }

        request.post({
                url: `${keys.secretAPI}/checkproviderid.php`,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                try {
                    const json = parser.toJson(body);
                    const parsedjson = JSON.parse(json)
                    res.send(parsedjson.response)

                }
                catch (err) {
                    res.status(404).send({ message: 'API failure could not load response' })
                }

            }) // end request

    })
    app.get("/projectmanagement/:providerid/loadcsi", (req, res) => {
        const providerid = req.params.providerid;

        request({
                url: `https://civilengineer.io/projectmanagement/api/loadcsi.php?providerid=${providerid}`,
                headers: {
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                try {
                    const json = parser.toJson(body);
                    const parsedjson = JSON.parse(json)
                    let response = parsedjson.response;
                    response = updateCSI(response)
                    res.send(response)

                }
                catch (err) {

                    res.status(404).send({ message: 'API failure could not load response' })
                }

            }) // end request

    })

    app.get("/projectmanagement/:providerid/checkcommission", (req, res) => {

        const providerid = req.params.providerid;
        let values = { providerid }

        request.post({
                url: `https://civilengineer.io/projectmanagement/api/checkcommission.php`,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                try {
                    const json = parser.toJson(body);
                    const parsedjson = JSON.parse(json)
                    res.send(parsedjson.response)

                }
                catch (err) {
                    res.status(404).send({ message: 'API failure could not load response' })
                }

            }) // end request

    })
    app.get("/projectmanagement/:projectid/checkprojectid", (req, res) => {

        const projectid = req.params.projectid;


        request({
                url: `https://civilengineer.io/projectmanagement/api/checknewprojectid.php?projectid=${projectid}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                try {
                    const json = parser.toJson(body);
                    const parsedjson = JSON.parse(json)
                    res.send(parsedjson.response)

                }
                catch (err) {
                    res.status(404).send({ message: 'API failure could not load response' })
                }

            }) // end request

    })


    app.post("/projectmanagement/user/checkemailaddress", (req, res) => {
        console.log(req.body)
        request.post({
                url: `https://civilengineer.io/projectmanagement/api/checkemailaddress.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                try {
                    const json = parser.toJson(body);
                    const parsedjson = JSON.parse(json)
                    res.send(parsedjson.response)

                }
                catch (err) {
                    res.status(404).send({ message: 'API failure could not load response' })
                }

            }) // end request

    })
    app.get("/projectmanagement/user/logout", (req, res) => {

        req.session.destroy();
        res.redirect(keys.clientAPI)


    })

    app.get("/projectmanagement/:providerid/logout", (req, res) => {
        let providerid = req.params.providerid;

        req.session.destroy(function(err) {
            if (err) {
                console.log(err);
                res.send({ error: err })
            }
            else {


                res.send({ logout: providerid })
            }
        });

        //let values = { providerid }
        //request.post({
        //        url: `${keys.secretAPI}/logout.php`,
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

        res.send({ message: 'Hello React Native' })
    })

    app.post("/projectmanagement/:providerid/uploadprofileimage", removeprofilephoto, uploadprofileimage, (req, res) => {
   
   request.post({
                url: `https://civilengineer.io/projectmanagement/api/userendpoint.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }

            },
            function(err, httpResponse, body) {
                try {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json);
                    let response = parsedjson.response;
                    response = updateAllProjects(response);
                    response = updateAllUsers(response);
                    res.send(response)
                }
                catch (err) {
                    console.log(err)

                    res.status(404).send({ message: 'Server Could Not Load Response, Please Try again later' })
                }

            }) // end request

        //var formData = {
        //    providerid,
        //    access,
        //    my_file: fs.createReadStream(fileName),
        //};

        //request.post({
        //        url: `${keys.secretAPI}/uploadprofilephoto.php`,
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




    })

    app.get('/projectmanagement/checkuser', (req, res) => {

        if (req.hasOwnProperty("session")) {
            if (req.session.hasOwnProperty("user")) {

                if (req.session.user.hasOwnProperty("providerid")) {

                    let providerid = req.session.user.providerid;
                    let values = { providerid };
                    const url = `https://civilengineer.io/projectmanagement/api/loadresponse.php?providerid=${providerid}`;

                    request({
                            url,
                            headers: {
                                'Permission': `${keys.grantAuthorization}`
                            }
                        },
                        function(err, httpResponse, body) {
                            try {
                                let json = parser.toJson(body);
                                let parsedjson = JSON.parse(json);
                                let response = parsedjson.response;
                                response = updateAllProjects(response);
                                response = updateAllUsers(response)
                                res.send(response);
                            }
                            catch (err) {
                                res.status(404).send({ message: 'API failure could not load response' })
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
