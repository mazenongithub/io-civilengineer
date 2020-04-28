module.exports = (req, res, next) => {
    let providerid = req.params.providerid;

    if (providerid) {

        if (req.session.hasOwnProperty("user")) {
            if (req.session.user.hasOwnProperty("pm")) {

                if (req.session.user.pm === req.params.providerid) {
                    next();
                }
                else {
                    res.status(401).send(`User Parameter mismatch unauthorized not allowed`)
                }
            }
            else {

                res.status(401).send(`User Parameter mismatch unauthorized not allowed`)
            }
        }
        else {
            console.log("User does not exist")
            res.status(401).send(`User Parameter mismatch unauthorized not allowed`)
        }

    }
    else {
        console.log(`Provider ID does not exist`)
        res.status(401).send(`Missing Parameter mismatch unauthorized not allowed`)
    }


}
