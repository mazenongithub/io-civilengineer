const bcrypt = require('bcryptjs')
class AppBasedDriver {

    constructor(driver) {

        this.driver = driver;

    }


    updateDriver() {

        const driver = Object.create(this.driver);

        if (driver.apple) {
            driver.apple = bcrypt.hashSync(driver.apple, 10);
        }

        if (driver.google) {
            driver.google = bcrypt.hashSync(driver.google, 10);
        }


        return driver;
    }


}

module.exports = AppBasedDriver;
