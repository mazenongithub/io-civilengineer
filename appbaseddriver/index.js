const mongoose = require("mongoose")

module.exports = app => {

    const DriverSchema = new mongoose.Schema({
        driverid: String,
        google: String,
        apple: String,
        profile: String,
        firstname: String,
        lastname: String,
        emailaddress: String,
        profileurl: String,
        phonenumber: String,
        equipment: [{
            equipmentid: String,
            equipment: String,
            ownership: {
                dateofpurchase: String,
                purchaseprice: String,
                saledate: String,
                saleprice: String,
                apr: String,
                costs: [{
                    costid: String,
                    dateofpurchase: String,
                    purchaseprice: String,
                    saledate: String,
                    saleprice: String,
                    apr: String
                }]

            },
            driver: {
                shifts: [{
                    shiftid: String,
                    timein: String,
                    timeout: String,
                    deliveries: String,
                    income: String
                }]
            }

        }]


    });





    app.get('/appbaseddriver', (req, res) => {

        const driver = {
            driverid: 'mazen',
            google: 'google',
            apple: 'apple',
            profile: 'profile',
            firstname: 'firstname',
            lastname: 'lastname',
            emailaddress: 'emailaddress',
            profileurl: 'profileurl',
            phonenumber: 'phonenumber',
            equipment: [{
                equipmentid: 'equipmentid',
                equipment: 'equipment',
                ownership: {
                    dateofpurchase: 'dateofpurchase',
                    purchaseprice: 'purchaseprice',
                    saledate: 'saledate',
                    saleprice: 'saleprice',
                    apr: 'apr',
                    costs: [{
                        costid: 'costid',
                        dateofpurchase: 'dateofpurchase',
                        purchaseprice: 'purchaseprice',
                        saledate: 'saledate',
                        saleprice: 'saleprice',
                        apr: 'apr'
                    }]

                },
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


        const mydriver = mongoose.model("appbaseddriver", DriverSchema);

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
