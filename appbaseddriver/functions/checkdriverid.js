module.exports = (req, res, next) => {

    if (req.session.hasOwnProperty("user")) {

        if (req.session.user.hasOwnProperty("driverid")) {

            if (req.session.user.driverid === req.params.driverid) {

                res.send({ valid: req.params.driverid })
            }
            else {
                next()
            }


        }
        else {
            next();
        }
    }
    else {
        next();
    }


}
