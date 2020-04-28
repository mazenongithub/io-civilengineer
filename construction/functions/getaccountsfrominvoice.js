const keys = require('../keys');
const request = require("request");
module.exports = (req, res, next) => {
    const invoiceid = req.params.invoiceid;
    request.get(`https://civilengineer.io/construction/api/getaccountsfrominvoiceid.php?invoiceid=${invoiceid}`, {
            headers: {
                'Permission': `${keys.grantAuthorization}`
            }

        },
        function(err, httpResponse, body) {

            const response = JSON.parse(body)
            console.log(response)
            const myinvoice = response;


            const checkaccount = (accounts, accountid) => {
                let check = true;
                accounts.map(account => {
                    if (account.accountid === accountid) {
                        check = false;
                    }

                })
                return check;
            }

            const accountkeybyid = (accounts, accountid) => {
                let key = false;
                accounts.map((account, i) => {
                    if (account.accountid === accountid) {
                        key = i;
                    }
                })
                return key;
            }

            let accounts = [];

            myinvoice.labor.map(labor => {
                let amount = labor.amount * (1 + (labor.profit / 100));
                labor.accounts.map(account => {
                    if (checkaccount(accounts, account.accountid)) {
                        
                       accounts.push({stripe:account.stripe,amount:amount*account.ratio})

                    }
                    else {
                        const i = accountkeybyid = (accounts, account.accountid);
                        let newamount = accounts[i].amount + (amount * account.ratio);
                        accounts[i].amount = newamount;

                    }

                })
            })

            myinvoice.materials.map(material => {
                let amount = material.quantity * material.unitcost * (1 + ((material.profit) / 100))
                let accountid = material.accountid;
                let stripe = material.stripe;
                if (checkaccount(accounts, accountid)) {

                    accounts.push({ stripe, amount })
                }
                else {
                    const j = accountkeybyid(accounts, accountid);
                    let newamount = accounts[j].amount + amount;
                    accounts[j].amount = newamount;
                }

            })

            myinvoice.equipment.map(equipment => {
                let amount = equipment.amount * (1 + (equipment.profit / 100))
                let accountid = equipment.accountid;
                let stripe = equipment.stripe;
                if (checkaccount(accounts, accountid)) {
                    accounts.push({ stripe, amount })
                }
                else {
                    const k = accountkeybyid(accounts, accountid);
                    let newamount = accounts[k].amount + amount;
                    accounts[k].amount = newamount;

                }

            })

            req.body.accounts = accounts;



        }) // end request
    next();


}
