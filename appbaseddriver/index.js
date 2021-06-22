const mongoose = require("mongoose")
const request = require("request")
const keys = require("./keys")
const checkuser = require("./functions/checkuser");
const AppBasedDriver = require("./functions/appbaseddriver");
const bcrypt = require("bcryptjs")
var js2xmlparser = require("js2xmlparser");
const securexml = require("./functions/securexml");
const uploadReceipt = require("./functions/uploadreceipt");
const removeReceipt = require("./functions/removereceipt");


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
                reimbursable: Boolean,
                recharge: {
                    totalenergy: String,
                    duration: {
                        hours: String,
                        minutes: String,
                        seconds: String
                    }
                },
                reoccurring: {
                    frequency: String
                },
                images: [{
                    imageid: String,
                    url: String
                }]
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


    app.post('/appbaseddriver/users/clientlogin', (req, res) => {
        // check if apple or google
        const appbaseddriver = new AppBasedDriver();
        const { firstname, lastname, emailaddress, phonenumber, profileurl, apple, google, driverid } = req.body
        //const apple = '000353.66d2a1610de24944b898df602ab5e7a7.0305';


        if (apple) {

            appbaseddriver.getAppleUser(mydriver, apple)
                .then((succ) => {


                    req.session.appbaseddriver = succ._id;
                    res.send(succ)

                })
                .catch((err) => {


                    if (driverid && (apple)) {


                        let myuser = { driverid, firstname, lastname, emailaddress, phonenumber, profileurl, apple }
                        myuser.apple = appbaseddriver.hashPassword(apple)

                        appbaseddriver.registerNewUser(mydriver, myuser)

                            .then((succ) => {

                                req.session.appbaseddriver = succ._id;
                                res.send(succ)

                            })

                            .catch((error) => {

                                res.status(404).send({ message: `Register Error ${error}` })

                            })


                    }
                    else {

                        if (!driverid && apple) {


                            res.send({ register: `Register Apple ID ` })

                        }
                        else {

                            res.send.status(404).send({ message: `Apple Client Missing  ` })

                        } // missing driver id

                    } // if driver id and apple 


                }) // end of catch


        } // end of apple


        else if (google) {

            appbaseddriver.getGoogleUser(mydriver, google)
                .then((succ) => {


                    req.session.appbaseddriver = succ._id;
                    res.send(succ)

                })
                .catch((err) => {


                    if (driverid && (google)) {


                        let myuser = { driverid, firstname, lastname, emailaddress, phonenumber, profileurl, google }
                        myuser.google = appbaseddriver.hashPassword(google)

                        appbaseddriver.registerNewUser(mydriver, myuser)

                            .then((succ) => {

                                req.session.appbaseddriver = succ._id;
                                res.send(succ)

                            })

                            .catch((err) => {

                                res.status(404).send({ message: `Register Error ${err}` })

                            })


                    }
                    else {

                        if (!driverid && google) {


                            res.send({ register: `Register Google ID ` })

                        }
                        else {

                            res.send.status(404).send({ message: `Google Client Missing  ` })

                        } // missing driver id

                    } // if driver id and apple 


                }) // end of catch



        } // end if google



    })

    app.post('/appbaseddriver/:driverid/savedriver', (req, res) => {




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


    app.post('/appbaseddriver/removereceipt', checkuser, removeReceipt, (req, res) => {

        let myuser = req.body.myuser;


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


    })



    app.post('/appbaseddriver/uploadreceipt', checkuser, uploadReceipt, (req, res) => {

        let myuser = req.body.myuser;


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


    })

    app.get('/appbaseddriver/:driverid/receipts/:year/security/:security', securexml, (req, res) => {

        const driverid = req.params.driverid;
        const year = req.params.year;

        mydriver.findOne({ driverid: driverid }, function(err, succ) {
            if (succ) {
                succ = Object.create(succ)

                try {

                    if (succ.driverid) {
                        const appbaseddriver = new AppBasedDriver();
                        const json = appbaseddriver.receiptReport(succ, year)
                        const response = js2xmlparser.parse("receipts", json)
                        res.set('Content-Type', 'text/xml');
                        res.send(response)
                    }
                    else {
                        const json = { message: `Driver Not Found` }
                        const response = js2xmlparser.parse("receipts", json)
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



    app.get('/appbaseddriver/checkuser', (req, res) => {


        // const driverid = req.session.appbaseddriver;


        const driverid = '60b7c81b2e541b148deeaadb';

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
