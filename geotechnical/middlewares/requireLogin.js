module.exports = (req, res, next) => {
    if (req.params.clientid === "gus") {
        next();
    }
    if (req.hasOwnProperty("session")) {
        if (req.session.hasOwnProperty("user")) {
            if (req.session.user.clientid === req.params.clientid) {
                next();

            }
            else if (req.session.user.clientid === 'mazen') {
                next();
            }
            else {
                return res.status(401).send({ errorMessage: 'You must be logged in to view this!' });
            }

        }
        else {
            return res.status(401).send({ errorMessage: 'You must be logged in to view this!' });
        }
    }
    else {
        return res.status(401).send({ errorMessage: 'You must be logged in to view this!' });
    }




};
