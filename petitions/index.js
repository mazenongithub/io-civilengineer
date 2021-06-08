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
    const mongoose = require('mongoose');
    const petitions = require('./functions')

    module.exports = app => {

        const Petitions = new mongoose.Schema({
            userid: String,
            firstname: String,
            lastname: String,
            apple: String,
            google: String,
            emailaddress: String,
            phonenumber: String,
            petitions: [{
                petitionid: String,
                petition: String,
                versus: String,
                openingstatement: String,
                url: String,
                conflicts: [{
                    conflictid: String,
                    conflict: String,
                    images: [{
                        imageid: String,
                        image: String()
                    }],
                    arguements: [{
                        arguementid: String,
                        arguement: String,
                        images: [{
                            imageid: String,
                            image: String
                        }]
                    }]
                }]
            }]

        });

        const Comment = new mongoose.Schema({

            petitionid: String,
            comments: [{
                commentid: String,
                comment: String
            }],
            likes: [{
                userid: String
            }]

        });


        const myusers = mongoose.model("petition", Petitions)
        const comments = mongoose.model("comment", Comment)


        app.get('/petitions/getallpetitions', (req, res) => {


            petitions.getAllPetitions(myusers)
                .then(succ => {

                    res.send({ petitions: succ })
                })
                .catch(err => {

                    res.send({ err })
                })

        })

        app.get('/petitions/getallpetitions/:petitionid', (req, res) => {

            const petitionid = req.params.petitionid;

            petitions.getPetitionByID(myusers, petitionid)

                .then(succ => {

                    res.send({ petition: succ })
                })
                .catch(err => {

                    res.send({ err })
                })

        })


        app.post('/petitions/users/saveuser', checkUser, (req, res) => {

            const myuser = req.body.myuser


            petitions.saveUser(myusers, myuser)

                .then(succ => {
                    res.send(succ)
                })

                .catch(err => {
                    res.send({ err })
                })



        })



        app.get('/petitions/users/loaduser', checkUser, (req, res) => {


            const _id = req.session.petitions;



            petitions.loadUserProfile(myusers, _id)

                .then(succ => {
                    res.send(succ)
                })

                .catch(err => {
                    res.send({ err })
                })

            // const petition = new petitions({ peitionid: 'something' })
            // petition.save();
            //const myuser = new MyUser

        })


        app.post('/petitions/users/clientlogin', (req, res) => {

            const { firstname, lastname, emailaddress, phonenumber, profileurl, google, apple, userid } = req.body

            const myuser = { firstname, lastname, emailaddress, phonenumber, profileurl, apple, google, userid }
            console.log(myuser)


            if (apple) {

                petitions.getAppleUser(myusers, apple)
                    .then((succ) => {

                        req.session.petitions = succ._id;
                        res.send(succ)

                    })
                    .catch((err) => {


                        if (userid && (apple)) {


                            let myuser = { userid, firstname, lastname, emailaddress, phonenumber, profileurl, apple }
                            myuser.apple = petitions.hashPassword(apple)

                            petitions.registerNewUser(myusers, myuser)

                                .then((succ) => {

                                    req.session.petitions = succ._id;
                                    res.send(succ)

                                })

                                .catch((error) => {

                                    res.status(404).send({ message: `Register Error ${error}` })

                                })


                        }
                        else {

                            if (!userid && apple) {


                                res.send({ register: `Register Apple ID ` })

                            }
                            else {

                                res.send.status(404).send({ message: `Apple Client Missing  ` })

                            } // missing driver id

                        } // if driver id and apple 


                    }) // end of catch


            } // end of apple


            else if (google) {

                petitions.getGoogleUser(myuser, google)
                    .then((succ) => {


                        req.session.petitions = succ._id;
                        res.send(succ)

                    })
                    .catch((err) => {


                        if (userid && (google)) {


                            let myuser = { userid, firstname, lastname, emailaddress, phonenumber, profileurl, google }
                            myuser.google = petitions.hashPassword(google)

                            petitions.registerNewUser(myusers, myuser)

                                .then((succ) => {

                                    req.session.petitions = succ._id;
                                    res.send(succ)

                                })

                                .catch((err) => {

                                    res.status(404).send({ message: `Register Error ${err}` })

                                })


                        }
                        else {

                            if (!userid && google) {


                                res.send({ register: `Register Google ID ` })

                            }
                            else {

                                res.send.status(404).send({ message: `Google Client Missing  ` })

                            } // missing driver id

                        } // if driver id and apple 


                    }) // end of catch



            } // end if google



        })






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



        app.get('/petitions/users/:userid/logout', checkUser, (req, res) => {
            req.session.destroy();
            res.send({ message: `User Logged Out Successfully` })

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
    