const request = require("request");
const parser = require('xml2json');
const keys = require('./keys');
const updateUserProfile = require('./functions/updateUserProfile');
const updateAllUsers = require('./functions/updateAllUsers')


module.exports = app => {

    app.post('/petitions/:userid/userendpoint', (req, res) => {
        console.log(req.body)
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
                        let myuser = parsedjson.response.myuser;
                        myuser = updateUserProfile(myuser);
                        parsedjson.response.myuser = myuser;
                        req.session.user = { petitions: myuser.userid };
                        res.send({ response: parsedjson.response });
                    }

                }
                else {


                    res.send({ Error: 'API Submit Failure response' })
                }

            }) // end request


    })
    app.get('/petitions/users/:userid/logout', (req, res) => {
        req.session.destroy();
        res.redirect(`${keys.clientAPI}`)
    })
    app.get('/petitions/users/getallusers', (req, res) => {
        let url = `http://civilengineer.io/petitions/api/allusersendpoint.php`
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
                    let myuser = parsedjson.response;
                    myuser = updateAllUsers(myuser);
                    req.session.user = { petitions: myuser.userid };
                    res.send(myuser);
                }
                else {

                    const errorMessage = `There was an error requesting the projects  ${url}`
                    res.send({ errorMessage });
                }

            }) // end request

    })
    app.get('/petitions/checkuser/application', (req, res) => {
        if (req.hasOwnProperty("session")) {
            if (req.session.hasOwnProperty("user")) {
                if (req.session.user.hasOwnProperty("petitions")) {
                    let userid = req.session.user.petitions;
                    let url = `http://civilengineer.io/petitions/api/loadmyprofile.php?userid=${userid}`
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
                                let myuser = parsedjson.myuser;
                                myuser = updateUserProfile(myuser);
                                myuser = updateAllUsers(myuser);
                                req.session.user = { petitions: myuser.userid };
                                res.send({ myuser });
                            }
                            else {

                                const errorMessage = `There was an error requesting the projects  ${url}`
                                res.send({ errorMessage });
                            }

                        }) // end request


                }
                else {
                    res.send({ message: ' There is no user logged into this application' })
                }
            }
            else {
                res.send({ message: ' There is no user logged into this application' })
            }
        }
        else {
            res.send({ message: ' There is no user logged into this application' })
        }
    })
    app.post('/petitions/newusers/register', (req, res) => {


        let url = `http://civilengineer.io/petitions/api/register.php`
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
                    if (!err) {
                        let json = parser.toJson(body);
                        let parsedjson = JSON.parse(json);
                        let myuser = parsedjson.myuser;
                        myuser = updateUserProfile(myuser);
                        console.log(myuser)
                        req.session.user = { petitions: myuser.userid };
                        res.redirect(`${keys.clientAPI}`)
                    }
                    else {


                        res.redirect(`${keys.clientAPI}`)
                    }

                }) // end request

        }
        catch (err) {
            res.send({ error: err })
        }


    })
    app.post('/petitions/login', (req, res) => {
        console.log(req.body)
        let url = `http://civilengineer.io/petitions/login.php`
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
                    if (!err) {
                        let json = parser.toJson(body);
                        let parsedjson = JSON.parse(json);
                        let myuser = parsedjson.myuser;
                        myuser = updateUserProfile(myuser);
                        myuser = updateAllUsers(myuser);
                        req.session.user = { petitions: myuser.userid };
                        res.send({ myuser });
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
                        let myuser = parsedjson.myuser;
                        myuser = updateUserProfile(myuser)
                        res.send({ myuser });
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

}
