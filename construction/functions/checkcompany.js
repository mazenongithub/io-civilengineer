const request = require("request");
const keys = require('../keys');
module.exports = (req, res, next) => {;
    const providerid = 'mazen'
    const companyurl = req.params.companyurl


    request.post({
            url: `https://civilengineer.io/construction/api/checkcompany.php?providerid=${providerid}&companyurl=${companyurl}`,
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

            }


        })







}
