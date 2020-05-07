module.exports = (req, res, next) => {
    if (req.hasOwnProperty("session")) {

        if (req.session.hasOwnProperty("user")) {

            if (req.session.user.hasOwnProperty("pm")) {
                return next();
            }
            else {
                res.status(404).send({ message: `There is no user logged in, Please Login to Access Content ` })
            }

        }
        else {
            res.status(404).send({ message: 'There is no user logged in, Please Login to Access Content ' })
        }

    }
    else {
        res.status(404).send({ message: 'There is no user logged in, Please Login to Access Content ' })
    }



}
