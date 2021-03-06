const mongoose = require("mongoose")
const request = require("request")
const keys = require("./keys")
const checkuser = require("./functions/checkuser");
const AppBasedDriver = require("./functions/appbaseddriver");
const bcrypt = require("bcryptjs")
var js2xmlparser = require("js2xmlparser");
const securexml = require("./functions/securexml");


module.exports = app => {


    const DriverSchema = new mongoose.Schema({
        driverid: String,
        google: String,
        apple: String,
        firstname: String,
        lastname: String,
        emailaddress: String,
        profileurl: String,
        phonenumber: String,
        equipment: [{
            equipmentid: String,
            equipment: String,
            repayment: {
                salvagedate: String,
                salvage: String,
                purchasedate: String,
                purchase: String,
                apr: String
            },
            costs: [{
                costid: String,
                detail: String,
                purchasedate: String,
                amount: String,
                reoccurring: {
                    frequency: String
                }
            }],
        }],
        driver: {
            shifts: [{
                shiftid: String,
                timein: String,
                timeout: String,
                deliveries: String,
                earnings: String,
                miles: String,

            }]
        }





    });

    const mydriver = mongoose.model("appbaseddrivers", DriverSchema);

    app.post('/appbaseddriver/:driverid/savedriver', checkuser, (req, res) => {


        const myuser = req.body.myuser;

        const filter = { _id: myuser._id }

        const options = {
            strict: false,
            new: true,
            upsert: true,
            useFindAndModify: false
        }


        mydriver.findByIdAndUpdate(filter, myuser, options, function(err, succ) {

            if (err) {
                console.log(err);
            }
            else {

                res.send(succ);
            }
        });

    });




    app.post('/appbaseddriver/clientlogin', (req, res) => {

        if (req.body.type === 'login') {


            let filter = { driverid: req.body.driverid }


            mydriver.findOne(filter, (err, succ) => {

                if (succ) {

                    const driver = Object.create(succ);

                    if (driver.apple) {

                        if (bcrypt.compareSync(req.body.apple, driver.apple)) {
                            req.session.appbaseddriver = succ._id;
                            res.send(succ)

                        }
                        else {
                            res.status(404).send({ message: 'Apple Login Failed' })
                        }


                    }
                    else if (driver.google) {

                        if (bcrypt.compareSync(req.body.google, driver.google)) {
                            req.session.appbaseddriver = succ._id;
                            res.send(succ)

                        }
                        else {
                            res.status(404).send({ message: `Google Login Failed ${req.body.google} and ${driver.google }` })

                        }

                    }

                }

                else {


                    res.status(404).send({ message: `Driver ID not Found ` })
                }

            })

        }

        else if (req.body.type === 'register') {
            const appbaseddriver = new AppBasedDriver();

            let { driverid, firstname, lastname, emailaddress, phonenumber, profileurl, apple, google } = req.body

            if (apple) {
                apple = appbaseddriver.hashPassword(apple)
            }
            if (google) {
                google = appbaseddriver.hashPassword(google)
            }


            const newdriver = new mydriver({ driverid, firstname, lastname, emailaddress, phonenumber, apple, google, profileurl })

            mydriver.create(newdriver, function(err, succ) {
                if (succ) {
                    req.session.appbaseddriver = succ._id;

                    res.send(succ)
                }
                else {
                    res.status(404).send({ message: `Could not register user ${err } ` })
                }
            });

        }


    })



    app.get('/appbaseddriver/:driverid/logout', checkuser, (req, res) => {
        req.session.destroy();
        res.send({
            "message": `${ req.params.driverid } has been logged out `
        })

    })


    app.get('/appbaseddriver/:emailaddress/checkemailaddress', checkuser, (req, res) => {

        const driverid = req.session.appbaseddriver
        mydriver.findById({ _id: driverid }, function(err, succ) {
            if (succ) {
                console.log(succ.emailaddress, req.params.emailaddress)
                if (succ.emailaddress === req.params.emailaddress) {
                    res.send({ valid: req.params.emailaddress })
                }
                else {
                    mydriver.findOne({ emailaddress: req.params.emailaddress }, function(err_1, succ_1) {
                        if (succ_1) {
                            res.send({ invalid: `${ req.params.emailaddress } is taken ` })

                        }
                        else {
                            res.send({ valid: `${ req.params.emailaddress } ` })

                        }
                    })


                }

            }

        })



    })


    app.get('/appbaseddriver/:driverid/checkdriverid', (req, res) => {


        if (req.session.hasOwnProperty("appbaseddriver")) {
            const driverid = req.session.appbaseddriver;

            mydriver.findById({ _id: driverid }, function(err, succ) {
                if (succ) {
                    if (succ.driverid === req.params.driverid) {
                        res.send({ valid: req.params.driverid })
                    }
                    else {
                        mydriver.findOne({ driverid: req.params.driverid }, function(err_1, succ_1) {
                            if (succ_1) {
                                res.send({ invalid: `${req.params.driverid} is taken ` })

                            }
                            else {
                                res.send({ valid: `${req.params.driverid}` })

                            }
                        })


                    }

                }
            })

        }

        else {
            mydriver.findOne({ driverid: req.params.driverid }, function(err_2, succ_2) {
                if (succ_2) {
                    res.send({ invalid: `${req.params.driverid } is taken ` })

                }
                else {
                    res.send({ valid: `${req.params.driverid } ` })

                }
            })
        }



    })

    app.get('/appbaseddriver/:driverid/year/:year/security/:security', securexml, (req, res) => {
        const driverid = req.params.driverid;
        const year = req.params.year;

        mydriver.findOne({ driverid: driverid }, function(err, succ) {
            if (succ) {
                succ = Object.create(succ)

                try {

                    if (succ.driverid) {
                        const appbaseddriver = new AppBasedDriver();
                        const json = appbaseddriver.annualReport(succ, year)
                        const response = js2xmlparser.parse("driver", json)
                        res.set('Content-Type', 'text/xml');
                        res.send(response)
                    }
                    else {
                        const json = { message: `Driver Not Found` }
                        const response = js2xmlparser.parse("driver", json)
                        res.set('Content-Type', 'text/xml');
                        res.send(response)
                    }



                }
                catch (err) {
                    console.log(err)
                }
            }
            else {

                res.status(404).send({ message: `Driver  ${driverid} Not Found ` });
            }

        })


    })



    app.get('/appbaseddriver/checkuser', checkuser, (req, res) => {


        const driverid = req.session.appbaseddriver;

        mydriver.findById({ _id: driverid }, function(err, succ) {
            if (succ) {

                res.send(succ)

            }
            else {

                res.status(404).send({ message: `Please Login In to Access AppBasedDriver ` });
            }

        })



    })



}
