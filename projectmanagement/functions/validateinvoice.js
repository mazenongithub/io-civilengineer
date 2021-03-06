const keys = require('../keys');
const request = require("request");
const serverkeys = require('../../keys');
const stripe = require("stripe")(serverkeys.STRIPE_SECRET);
const ProjectManagement = require('./projectmanagement')
module.exports = (req, res, next) => {
    let accountbalance = 0;
    try {

        stripe.balance.retrieve(function(err, balance) {
            // asynchronously called

            if (balance.hasOwnProperty("available")) {
                accountbalance = balance.available[0].amount;

            }
        

            if (accountbalance > 0) {

                request.post({
                        url: `https://civilengineer.io/projectmanagement/api/validateinvoice.php`,
                        form: req.body,
                        headers: {
                            'Content-Type': 'application/json',
                            'Permission': `${keys.grantAuthorization}`
                        }
                    },
                    function(err, httpResponse, body) {

                        try {

                            const settlement = JSON.parse(body)
                          
                            const projectmanagement = new ProjectManagement();
                            const validateSettlement = projectmanagement.validateSettlement(settlement);
                            if (validateSettlement) {
                                res.status(404).send({ message: validateSettlement })
                            }
                            else {
                                next();
                            }


                        }

                        catch (err) {
                            res.status(404).send({ message: `Could not validate invoice ${err}` })
                        }


                        //values returned from DB


                    }) // end request


            }
            else {
                res.status(404).send({ message: `Account Balance is zero` })

            }



        })











    }
    catch (err) {

        res.status(404).send({ message: `Could not retrieve account balance ${err}` })

    }
  








}
