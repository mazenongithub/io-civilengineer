const mongoose = require("mongoose")
const request = require("request")
const keys = require("./keys")
const checkuser = require("./functions/checkuser");
const checkdriverid = require("./functions/checkdriverid")

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
                    req.session.user = { appbaseddriver: succ.driverid }
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
                    req.session.user = { appbaseddriver: succ.driverid }
                    res.send(succ)
                }
                else {
                    res.status(404).send({ message: `Could not register user ${err}` })
                }
            });

        }


    })


    app.get('/appbaseddriver/:driverid/checkdriverid', checkdriverid, (req, res) => {
        console.log(req.params.driverid)

        mydriver.findOne({ driverid: req.params.driverid }, function(err, succ) {
            console.log(succ, err)
            if (succ) {
                res.send({ invalid: `${req.params.driverid} is taken ` })
            }
            else {

                res.send({ valid: req.params.driverid });
            }

        })

    })


    app.get('/appbaseddriver/checkuser', checkuser, (req, res) => {

        mydriver.findOne({ driverid: req.session.user.appbaseddriver }, function(err, succ) {
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
