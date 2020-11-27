const mongoose = require("mongoose")
const request = require("request")
const keys = require("./keys")
const checkuser = require("./functions/checkuser");

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
            financed: {
                purchasedate: String,
                principal: String,
                salvage: String,
                apr: String,
            },
            costs: [{
                costid: String,
                purchasedate: String,
                purchaseprice: String,
                detail: String,
            }],
            driver: {
                shifts: [{
                    shiftid: String,
                    timein: String,
                    timeout: String,
                    deliveries: String,
                    income: String,
                }]
            }

        }]



    });

    const mydriver = mongoose.model("appbaseddriver", DriverSchema);

    app.post('/appbaseddriver/:driverid/savedriver', checkuser, (req, res) => {

        const driverid = req.params.driverid;
        const myuser = req.body.myuser;
        console.log(mydriver)

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


            let filter = {};
            if (req.body.google) {
                filter = { google: req.body.google }

            }
            else if (req.body.apple) {
                filter = { apple: req.body.apple };

            }


            mydriver.findOne(filter, (err, succ) => {

                if (succ) {
                    req.session.user = { appbaseddriver: succ._id }
                    res.send(succ)
                }

                else {

                    let errmsg = "";
                    if (filter.hasOwnProperty("apple")) {
                        errmsg = `Apple Client Not Registered. Please Register your account `
                    }
                    else if (filter.hasOwnProperty("google")) {

                        errmsg = `Google Client Not Registered. Please Register your account `
                    }
                    res.status(404).send({ message: errmsg })
                }

            })

        }

        else if (req.body.type === 'register') {

            const { driverid, firstname, lastname, emailaddress, phonenumber, apple, google, profileurl } = req.body
            const newdriver = { driverid, firstname, lastname, emailaddress, phonenumber, apple, google, profileurl }

            mydriver.create(newdriver, function(err, succ) {
                if (succ) {
                    req.session.user = { appbaseddriver: succ._id }
                    res.send(succ)
                }
                else {
                    res.status(404).send({ message: `Could not register user ${err}` })
                }
            });

        }


    })



    app.get('/appbaseddriver/:driverid/logout', checkuser, (req, res) => {
        req.session.destroy();
        res.send({
            "message": `${req.params.driverid} has been logged out`
        })

    })


    app.get('/appbaseddriver/:emailaddress/checkemailaddress', checkuser, (req, res) => {

        const driverid = req.session.user.appbaseddriver;
        mydriver.findById({ _id: driverid }, function(err, succ) {
            if (succ) {
                console.log(succ.emailaddress, req.params.emailaddress)
                if (succ.emailaddress === req.params.emailaddress) {
                    res.send({ valid: req.params.emailaddress })
                }
                else {
                    mydriver.findOne({ emailaddress: req.params.emailaddress }, function(err_1, succ_1) {
                        if (succ_1) {
                            res.send({ invalid: `${req.params.emailaddress} is taken` })

                        }
                        else {
                            res.send({ valid: `${req.params.emailaddress}` })

                        }
                    })


                }

            }

        })



    })


    app.get('/appbaseddriver/:driverid/checkdriverid', (req, res) => {

        if (req.session.hasOwnProperty("user")) {
            if (req.session.user.hasOwnProperty("appbaseddriver")) {
                const driverid = req.session.user.appbaseddriver;
                mydriver.findById({ _id: driverid }, function(err, succ) {
                    if (succ) {
                        if (succ.driverid === req.params.driverid) {
                            res.send({ valid: req.params.driverid })
                        }
                        else {
                            mydriver.findOne({ driverid: req.params.driverid }, function(err_1, succ_1) {
                                if (succ_1) {
                                    res.send({ invalid: `${req.params.driverid} is taken` })

                                }
                                else {
                                    res.send({ valid: `${req.params.driverid}` })

                                }
                            })


                        }

                    }

                })

            }


        }
        else {
            mydriver.findOne({ driverid: req.params.driverid }, function(err_2, succ_2) {
                if (succ_2) {
                    res.send({ invalid: `${req.params.driverid} is taken` })

                }
                else {
                    res.send({ valid: `${req.params.driverid}` })

                }
            })
        }



    })


    app.get('/appbaseddriver/checkuser', checkuser, (req, res) => {
        const driverid = req.session.user.appbaseddriver;
        //const driverid = '5fc14cf79e9f91244648e819';
        req.session.user = { appbaseddriver: driverid }
        mydriver.findById({ _id: driverid }, function(err, succ) {
            if (succ) {

                res.send(succ)

            }
            else {

                res.status(404).send({ message: ` Please Login In to Access AppBasedDriver` });
            }

        })



    })


    app.get('/appbaseddriver/sampleuser', (req, res) => {

        const driver = {
            driverid: 'mazen',
            google: 'google',
            apple: '000353.66d2a1610de24944b898df602ab5e7a7.0305',
            profile: 'profile',
            firstname: 'firstname',
            lastname: 'lastname',
            emailaddress: 'emailaddress',
            profileurl: 'profileurl',
            phonenumber: 'phonenumber',
            equipment: [{
                equipmentid: 'equipmentid',
                equipment: 'equipment',
                financed: {
                    purchasedate: 'dateofpurchase',
                    principal: 'purchaseprice',
                    salvage: 'saleprice',
                    apr: 'apr'
                },
                costs: [{
                    costid: 'costid',
                    purchasedate: 'dateofpurchase',
                    purchaseprice: 'purchaseprice',
                    detail: 'saleprice'
                }],
                driver: {
                    shifts: [{
                        shiftid: 'shiftid',
                        timein: 'timein',
                        timeout: 'timeout',
                        deliveries: 'deliveries',
                        income: 'income'
                    }]
                }

            }]


        }




        const filter = { driverid: 'mazen' }


        const options = {

            strict: false,
            new: true,
            upsert: true,
            useFindAndModify: false


        }
        mydriver.findOneAndUpdate(filter, driver, options, function(err, succ) {
            if (err) {

                console.log(err);
            }
            else {
                res.send(succ);
            }
        });



    });



}
