module.exports = (req, res, next) => {
    if (req.hasOwnProperty("session")) {

        if (req.session.hasOwnProperty("user")) {

            if (req.session.user.hasOwnProperty("construction")) {
                return next();
            }
            else {
                res.status(404).send({ message: `You are not logged in ` })
            }

        }
        else {
            res.status(404).send({ message: 'You are not logged in ' })
        }

    }
    else {
        res.status(404).send({ message: 'You are not logged in ' })
    }



}
