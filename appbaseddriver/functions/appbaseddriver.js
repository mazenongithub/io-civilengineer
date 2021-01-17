const bcrypt = require('bcryptjs')
class AppBasedDriver {

    constructor(driver) {

        this.driver = driver;

    }


    updateDriver() {

        const mydriver = Object.create(this.driver);

        if (mydriver.apple) {
            mydriver.apple = bcrypt.hashSync(mydriver.apple, 10);
        }

        if (mydriver.google) {
            mydriver.google = bcrypt.hashSync(mydriver.google, 10);
        }

        return mydriver;
    }


}

module.exports = AppBasedDriver;
