module.exports = (req, res, next) => {
    if (req.session) {
        if (req.session.petitions) {

            next();
        }
        else {
            res.send({ message: `Cannot Access, Could not find User` })
        }
    }
    else {
        res.send({ message: `Cannot Access, Could not find User` })
    }

}
