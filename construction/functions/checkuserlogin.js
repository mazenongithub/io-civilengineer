module.exports = (req, res, next) => {
    if (req.hasOwnProperty("session")) {

        if (req.session.hasOwnProperty("user")) {

            if (req.session.user.hasOwnProperty("construction")) {
                return next();
            }
            else {
                res.status(404).send({ message: `There is no user logged in. Login to access content ` })
            }

        }
        else {
            res.status(404).send({ message: 'There is no user logged in. Login to access content ' })
        }

    }
    else {
        res.status(404).send({ message: 'There is no user logged in. Login to access content ' })
    }



}
