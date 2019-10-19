module.exports = (req, res, next) => {

    if (req.params.clientid === "gus" || req.params.clientid === "mazen") {
        return next();
    }
    else if (req.hasOwnProperty("session")) {
        if (req.session.hasOwnProperty("user")) {
            if (req.session.user.hasOwnProperty("clientid")) {
                if (req.session.user.clientid === "mazen") {
                    return next();
                }
                else if (req.params.clientid === req.session.user.clientid) {
                    return next();
                }
                else {
                    return res.status(401).send({ errorMessage: ' You must be logged in view this ' });
                }

            }
            else {
                return res.status(401).send({ errorMessage: ' You must be logged in view this ' });
            }


        }
        else {
            return res.status(401).send({ errorMessage: ' You must be logged in view this ' });
        }

    }
    else {
        return res.status(401).send({ errorMessage: ' You must be logged in view this ' });
    }
}
