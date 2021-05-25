    const request = require("request");
    const parser = require('xml2json');
    const keys = require('./keys');
    const updateUserProfile = require('./functions/updateUserProfile');
    const updateAllUsers = require('./functions/updateAllUsers');
    const s3fileuploader = require('./functions/s3fileuploader');
    const s3deleteprofileurl = require('./functions/s3deleteprofileurl');
    const s3arguementuploader = require('./functions/s3arguementuploader');
    const s3conflictuploader = require('./functions/s3conflictuploader')
    const s3petitiondeletephoto = require('./functions/s3petitiondeletephoto')
    const checkUser = require('./functions/checkuser')
    const validateUser = require('./functions/validateuser');

    module.exports = app => {



        app.get("/petitions/:emailaddress/checkemailaddress", (req, res) => {
            const emailaddress = req.params.emailaddress;

            let url = `https://civilengineer.io/petitions/api/checkemailaddress.php?emailaddress=${emailaddress}`

            request({
                    url,
                    headers: {
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

        app.post('/petitions/:userid/comments', (req, res) => {

            let url = `http://civilengineer.io/petitions/api/commentsendpoint.php`


            request.post({
                    url,
                    headers: {
                        'Content-Type': 'application/json',
                        'Permission': `${keys.grantAuthorization}`
                    },
                    form: req.body
                },
                function(err, httpResponse, body) {


                    try {
                        let json = parser.toJson(body);
                        let parsedjson = JSON.parse(json);
                        let response = parsedjson.response;
                        if (response.hasOwnProperty("allusers")) {
                            response = updateAllUsers(parsedjson.response);
                        }

                        res.send(response);

                    }
                    catch (err) {
                        res.status(404).send({ error: `BackEnd response error, please try again later` })
                    }


                }) // end request


        })

        app.post('/petitions/:imageid/deleteimage', s3petitiondeletephoto, (req, res) => {

            let url = `http://civilengineer.io/petitions/api/userendpoint.php`
            request.post({
                    url,
                    headers: {
                        'Content-Type': 'application/json',
                        'Permission': `${keys.grantAuthorization}`
                    },
                    form: req.body
                },
                function(err, httpResponse, body) {
                    if (!err) {

                        let json = parser.toJson(body);
                        let parsedjson = JSON.parse(json);
                        let response = parsedjson.response;
                        if (response.hasOwnProperty("myuser")) {
                            response = updateUserProfile(response);

                        }
                        if (response.hasOwnProperty("allusers")) {
                            response = updateAllUsers(response);
                        }
                        res.send(response)


                    }
                    else {


                        res.send({ Error: 'API Submit Failure response' })
                    }

                }) // end request

        })


        app.post('/petitions/arguements/:arguementid/uploadpetitionimage', s3arguementuploader, (req, res) => {

            let url = `http://civilengineer.io/petitions/api/userendpoint.php`
            request.post({
                    url,
                    headers: {
                        'Content-Type': 'application/json',
                        'Permission': `${keys.grantAuthorization}`
                    },
                    form: req.body
                },
                function(err, httpResponse, body) {
                    if (!err) {

                        let json = parser.toJson(body);
                        let parsedjson = JSON.parse(json);
                        let response = parsedjson.response;
                        if (response.hasOwnProperty("myuser")) {
                            response = updateUserProfile(response);

                        }
                        if (response.hasOwnProperty("allusers")) {
                            response = updateAllUsers(response);
                        }
                        res.send(response)

                    }
                    else {


                        res.send({ Error: 'API Submit Failure response' })
                    }

                }) // end request



        })


        app.post('/petitions/conflicts/:conflictid/uploadpetitionimage', s3conflictuploader, (req, res) => {

            let url = `http://civilengineer.io/petitions/api/userendpoint.php`
            request.post({
                    url,
                    headers: {
                        'Content-Type': 'application/json',
                        'Permission': `${keys.grantAuthorization}`
                    },
                    form: req.body
                },
                function(err, httpResponse, body) {
                    if (!err) {

                        let json = parser.toJson(body);
                        let parsedjson = JSON.parse(json);
                        let response = parsedjson.response;
                        if (response.hasOwnProperty("myuser")) {
                            response = updateUserProfile(response);

                        }
                        if (response.hasOwnProperty("allusers")) {
                            response = updateAllUsers(response);
                        }
                        res.send(response)

                    }
                    else {


                        res.send({ Error: 'API Submit Failure response' })
                    }

                }) // end request



        })


        app.post('/petitions/:userid/userendpoint', (req, res) => {

            let url = `http://civilengineer.io/petitions/api/userendpoint.php`

            request.post({
                    url,
                    headers: {
                        'Content-Type': 'application/json',
                        'Permission': `${keys.grantAuthorization}`
                    },
                    form: req.body
                },
                function(err, httpResponse, body) {
                    try {


                        let response = JSON.parse(body);
                        res.send(response);


                    }
                    catch (err) {


                        res.status(404).send({ Error: 'API Submit Failure response' })
                    }

                }) // end request


        })
        app.get('/petitions/users/:userid/logout', checkUser, (req, res) => {
            req.session.destroy();
            res.send({ message: `User Logged Out Successfully` })

        })

        app.get('/petitions/allusers', (req, res) => {
            let url = `http://civilengineer.io/petitions/api/allusers.php`
            request({
                    url,
                    headers: {
                        'Content-Type': 'application/json',
                        'Permission': `${keys.grantAuthorization}`
                    }
                },
                function(err, httpResponse, body) {
                    try {


                        let response = JSON.parse(body)

                        res.send(response)
                    }
                    catch (error) {

                        res.status(404).send({ message: ` Server Error, Could Not Load Petitions ${error}` });
                    }


                }) // end request

        })

        app.get("/petitions/:profile/checkuserid", validateUser, (req, res) => {

            const profile = req.params.profile;

            request.get(`https://civilengineer.io/petitions/api/checkuserid.php?profile=${profile}`, {
                    headers: {
                        'Permission': `${keys.grantAuthorization}`
                    }

                },
                function(err, httpResponse, body) {
                    try {

                        const response = JSON.parse(body)
                        res.send(response)

                    }
                    catch (err) {
                        res.status(404).send({ message: 'Server Could Not Load Response' })
                    }

                }) // end request

        })



        app.get('/petitions/users/checkuser', checkUser, (req, res) => {

            const userid = req.session.petitions.userid;


            let url = `http://civilengineer.io/petitions/api/loadmyprofile.php?userid=${userid}`
            request({
                    url,
                    headers: {
                        'Content-Type': 'application/json',
                        'Permission': `${keys.grantAuthorization}`
                    }
                },
                function(err, httpResponse, body) {

                    try {

                        let response = JSON.parse(body);
                        res.send(response);

                    }
                    catch (err) {

                        res.status(404).send({ message: `Could not Load User ${err}` })
                    }


                }) // end request


        })




        app.post('/petitions/users/login', (req, res) => {


            let url = `http://civilengineer.io/petitions/api/login.php`
            try {
                request.post({
                        url,
                        headers: {
                            'Content-Type': 'application/json',
                            'Permission': `${keys.grantAuthorization}`
                        },
                        form: req.body
                    },

                    function(err, httpResponse, body) {

                        try {

                            let response = JSON.parse(body);
                            if (response.myuser) {

                                req.session.petitions = { userid: response.myuser.userid, profile: response.myuser.profile }

                            }
                            res.send(response)

                        }


                        catch (err) {

                            res.status(404).send({ message: `Could Not Connect to Server ${err}` })
                        }



                    }) // end request

            }
            catch (err) {
                res.send({ error: err })
            }


        })



        app.get('/petitions/:userid', (req, res) => {
            let userid = req.params.userid;
            let url = `http://civilengineer.io/petitions/api/loadmyprofile.php?userid=${userid}`
            try {
                request({
                        url,
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
                            if (response.hasOwnProperty("myuser")) {
                                response = updateUserProfile(response);

                            }
                            if (response.hasOwnProperty("allusers")) {
                                response = updateAllUsers(response);
                            }

                            res.send(response);
                        }
                        else {

                            const errorMessage = `There was an error requesting the projects  ${url}`
                            res.send({ errorMessage });
                        }

                    }) // end request

            }
            catch (err) {
                res.send({ error: err })
            }


        })


        app.post("/petitions/:userid/uploadprofileimage", s3deleteprofileurl, s3fileuploader, (req, res) => {

            let url = `http://civilengineer.io/petitions/api/userendpoint.php`

            request.post({
                    url,
                    headers: {
                        'Content-Type': 'application/json',
                        'Permission': `${keys.grantAuthorization}`
                    },
                    form: req.body
                },
                function(err, httpResponse, body) {
                    if (!err) {

                        let json = parser.toJson(body);
                        let parsedjson = JSON.parse(json);
                        if (parsedjson.response.hasOwnProperty("myuser")) {
                            let response = parsedjson.response;
                            if (response.hasOwnProperty("myuser")) {
                                response = updateUserProfile(response);

                            }
                            if (response.hasOwnProperty("allusers")) {
                                response = updateAllUsers(response);
                            }

                            res.send(response);
                        }

                    }
                    else {


                        res.send({ Error: 'API Submit Failure response' })
                    }

                }) // end request


        })


    }
    