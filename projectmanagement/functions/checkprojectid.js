const request = require("request");
const keys = require('../keys');
module.exports = (req, res, next) => {


    request.post({
            url: 'https://civilengineer.io/projectmanagement/api/checkproject.php',
            form: req.body,
            headers: {
                'Content-Type': 'application/json',
                'Permission': `${keys.grantAuthorization}`
            }
        },
        function(err, httpResponse, body) {
            try {
                const response = JSON.parse(body)

                if (response.hasOwnProperty("valid")) {
                    res.send(response)
                }
                else {
                    next();
                }




            }
            catch (error) {
                next();
                console.log(error)
            }


        })







}
