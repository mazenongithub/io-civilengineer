module.exports = (req, res, next) => {
    console.log("validate user")

    if (req.session) {
        console.log("session", console.log(req.params.profile))
        if (req.session.petitions) {
            console.log("petitions")
            console.log(req.session.petitions, req.params.profile)
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
