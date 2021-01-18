const bcrypt = require('bcryptjs')
class AppBasedDriver {


    hashPassword(password) {

        return bcrypt.hashSync(password, 10);
    }


}

module.exports = AppBasedDriver;
