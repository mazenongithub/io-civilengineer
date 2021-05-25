module.exports = (req, res, next) => {

    if (req.session) {
        if (req.session.petitions) {
            if (req.session.petitions.profile === req.params.profile) {
                res.send({ valid: ` Destination Profile matches session variable ` })
            }
            else {
                next();
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
