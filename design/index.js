    const request = require("request");
    const keys = require("./keys")
    const checkUser = require('./functions/checkuser');
    const checkProfile = require('./functions/checkprofile');
    const checkEmail = require('./functions/checkemail')
    const checkCompany = require('./functions/checkcompany')

    module.exports = app => {


        app.post('/design/:projectid/savecostestimate', checkUser, (req, res) => {

            request.post({
                    url: `https://civilengineer.io/design/api/savecostestimate.php`,
                    form: req.body,
                    headers: {
                        'Content-Type': 'application/json',
                        'Permission': `${keys.grantAuthorization}`
                    }
                },

                function(err, httpResponse, body) {

                    try {

                        const response = JSON.parse(body)

                        res.send(response)


                    }

                    catch (err) {

                        res.status(404).send({ message: ` There was an error making the request ${err}` })



                    }

                })

        })


        app.get('/design/checkuser', checkUser, (req, res) => {
            const providerid = req.session.design;


            request({
                    url: `https://civilengineer.io/design/api/loadprofile.php?providerid=${providerid}`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Permission': `${keys.grantAuthorization}`
                    }
                },

                function(err, httpResponse, body) {

                    try {

                        const response = JSON.parse(body)

                        res.send(response)


                    }

                    catch (err) {

                        res.status(404).send({ message: ` There was an error making the request ${err}` })



                    }

                })

        })

        app.get('/design/:profile/checkproviderid', checkProfile, (req, res) => {

            const profile = req.params.profile

            request({
                    url: `https://civilengineer.io/design/api/checkproviderid.php?profile=${profile}`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Permission': `${keys.grantAuthorization}`
                    }
                },

                function(err, httpResponse, body) {

                    try {

                        const response = JSON.parse(body)

                        res.send(response)

                    }

                    catch (err) {

                        res.status(404).send({ message: ` There was an error making the request ${err}` })



                    }

                })

        })




        app.get('/design/:companyurl/checkcompanyurl', checkCompany, (req, res) => {

            const companyurl = req.params.companyurl;

            request({
                    url: `https://civilengineer.io/design/api/checkcompany.php?companyurl=${companyurl}`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Permission': `${keys.grantAuthorization}`
                    }
                },

                function(err, httpResponse, body) {

                    try {

                        const response = JSON.parse(body)

                        res.send(response)


                    }

                    catch (err) {

                        res.status(404).send({ message: ` There was an error making the request ${err}` })



                    }

                })

        })


        app.get('/design/:emailaddress/checkemailaddress', checkEmail, (req, res) => {

            const emailaddress = req.params.emailaddress;

            request({
                    url: `https://civilengineer.io/design/api/checkemailaddress.php?emailaddress=${emailaddress}`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Permission': `${keys.grantAuthorization}`
                    }
                },

                function(err, httpResponse, body) {

                    try {

                        const response = JSON.parse(body)

                        res.send(response)


                    }

                    catch (err) {

                        res.status(404).send({ message: ` There was an error making the request ${err}` })

                    }

                })

        })


        app.get('/design/:companyid/loadcsis', checkUser, (req, res) => {
            const companyid = req.params.companyid;

            request({
                    url: `https://civilengineer.io/design/api/loadcsi.php?companyid=${companyid}`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Permission': `${keys.grantAuthorization}`
                    }
                },

                function(err, httpResponse, body) {

                    try {

                        const response = JSON.parse(body)

                        res.send(response)

                    }

                    catch (err) {

                        res.status(404).send({ message: ` There was an error making the request ${err}` })



                    }

                })

        })


        app.get('/design/:companyid/allcompanys', checkUser, (req, res) => {
            const companyid = req.params.companyid;


            request({
                    url: `https://civilengineer.io/design/api/allcompanys.php?companyid=${companyid}`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Permission': `${keys.grantAuthorization}`
                    }
                },

                function(err, httpResponse, body) {

                    try {

                        const response = JSON.parse(body)
                        res.send(response)

                    }

                    catch (err) {

                        res.status(404).send({ message: ` There was an error making the request ${err}` })

                    }

                })

        })


        app.post('/design/:providerid/saveprofile', checkUser, (req, res) => {

            request.post({
                    url: `https://civilengineer.io/design/api/saveprofile.php`,
                    form: req.body,
                    headers: {
                        'Content-Type': 'application/json',
                        'Permission': `${keys.grantAuthorization}`
                    }
                },

                function(err, httpResponse, body) {

                    try {

                        const response = JSON.parse(body)

                        res.send(response)

                    }

                    catch (err) {

                        res.status(404).send({ message: ` There was an error making the request ${err}` })

                    }

                })

        })


        app.post('/design/savecsi', checkUser, (req, res) => {

            request.post({
                    url: `https://civilengineer.io/design/api/savecsi.php`,
                    form: req.body,
                    headers: {
                        'Content-Type': 'application/json',
                        'Permission': `${keys.grantAuthorization}`
                    }
                },

                function(err, httpResponse, body) {

                    try {

                        const response = JSON.parse(body)

                        res.send(response)

                    }

                    catch (err) {

                        res.status(404).send({ message: ` There was an error making the request ${err}` })


                    }

                })

        })


        app.post('/design/:csiid/deletecsi', checkUser, (req, res) => {

            request.post({
                    url: `https://civilengineer.io/design/api/deletecsi.php`,
                    form: req.body,
                    headers: {
                        'Content-Type': 'application/json',
                        'Permission': `${keys.grantAuthorization}`
                    }
                },

                function(err, httpResponse, body) {

                    try {

                        const response = JSON.parse(body)

                        res.send(response)

                    }

                    catch (err) {

                        res.status(404).send({ message: ` There was an error making the request ${err}` })

                    }

                })

        })


        app.get('/design/:providerid/logout', checkUser, (req, res) => {
            req.session.destroy();
            res.send({
                "message": `${req.params.providerid} has been logged out`
            })

        })


        app.post('/design/applelogin', (req, res) => {


            request.post({
                    url: `https://civilengineer.io/design/api/applelogin.php`,
                    form: req.body,
                    headers: {
                        'Content-Type': 'application/json',
                        'Permission': `${keys.grantAuthorization}`
                    }
                },

                function(err, httpResponse, body) {

                    try {

                        const response = JSON.parse(body)
                        if (response.hasOwnProperty("myuser")) {

                            req.session.design = response.myuser.myuser.providerid;
                            res.send(response)

                        }


                    }

                    catch (err) {

                        res.status(404).send({ message: ` There was an error making the request ${err}` })

                    }
                })


        })



    }

    //var restfulSchema = new mongoose.Schema({ firstname: String, lastname: String });
    //RestFul - 1 - Index Load all values
    //var people = mongoose.model("people", restfulSchema);
    