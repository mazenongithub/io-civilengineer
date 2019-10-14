module.exports = (req, res, next) => {
    let providerzipcode = false;
    if (req.session.user) {
        providerzipcode = req.session.user.providerzipcode
    }
    else {
        return res.send({ errorMessage: `You have to be logged in to make a payment` });
    }


    if (req.body.hasOwnProperty("token")) {
        if (req.body.token.hasOwnProperty("card")) {
            let address_zip = req.body.token.card.address_zip
            if (address_zip) {
                if (address_zip.toString().search(providerzipcode) !== -1) {
                    return next();
                }
                else {
                    return res.send({ errorMessage: `For security purposes The billing zip code must match the provider zip code ${providerzipcode}` });
                }

            }
            else {
                return res.send({ errorMessage: `Billing zip code is missing Transaction not allowed` });

            }
        }
        else {
            return res.send({ errorMessage: `Card not found inside of token` });
        }
    }
    else {
        return res.send({ errorMessage: `Token not found inside body` });
    }


}
