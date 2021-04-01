const keys = require('../keys')
module.exports = (req, res, next) => {

    if (req.params.security === keys.APPBASEDDRIVER_XML_API) {
        next();
    }
    else {
        res.status(404).send({ message: `Unauthorized request ${req.params.security}` })
    }


}
