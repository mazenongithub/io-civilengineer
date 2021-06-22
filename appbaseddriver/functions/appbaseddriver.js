const bcrypt = require('bcryptjs')



class AppBasedDriver {

    registerNewUser(mydriver, newdriver) {

        return new Promise((resolve, reject) => {

            mydriver.create(newdriver, function(err, succ) {
                if (succ) {

                    resolve(succ)

                }
                else {

                    reject(new Error(`Database Error: Could not Register User ${err}`))


                }
            });



        })
    }


    getAppleUser(mydriver, apple) {



        return new Promise((resolve, reject) => {

            let getdriver = false;

            mydriver.find({ apple: { $exists: true } }, (err, alldrivers) => {
                let getdriver = false;

                if (!err) {

                    alldrivers.map(driver => {


                        if (bcrypt.compareSync(apple, driver.apple)) {

                            getdriver = driver;

                        }



                    })


                    if (getdriver) {
                        resolve(getdriver)
                    }

                    else {


                        reject(new Error('Invalid Login'))
                    }


                }
                else {
                    reject(new Error('No Apple Users found'))
                }


            })





        }) // end of promise


    }



    getGoogleUser(mydriver, google) {

        mydriver.find({ google: { $exists: true } }, (err, succ) => {

                console.log(succ)
            }


        )


    }



    getImage(myuser, equipmentid, costid, imageid) {
        let getimage = false;
        const cost = this.getCost(myuser, equipmentid, costid);
        if (cost.images) {
            cost.images.map(image => {
                if (image.imageid === imageid) {
                    getimage = image;
                }
            })

        }
        return getimage;
    }


    getImageKey(myuser, equipmentid, costid, imageid) {
        let key = false;
        const cost = this.getCost(myuser, equipmentid, costid);
        if (cost.images) {
            cost.images.map((image, i) => {
                if (image.imageid === imageid) {
                    key = i;
                }
            })

        }
        return key;
    }

    getCost(myuser, equipmentid, costid) {
        let getCost = false;
        const equipment = this.getEquipment(myuser, equipmentid)
        if (equipment.costs) {
            equipment.costs.map((cost, i) => {
                if (cost.costid === costid) {
                    getCost = cost
                }
            })
        }
        return getCost
    }


    getCostKey(myuser, equipmentid, costid) {
        let key = false;
        const equipment = this.getEquipment(myuser, equipmentid)
        if (equipment.costs) {
            equipment.costs.map((cost, i) => {
                if (cost.costid === costid) {
                    key = i;
                }
            })
        }
        return key;
    }


    getEquipment(myuser, equipmentid) {

        let getequipment = false;
        if (myuser.equipment) {
            myuser.equipment.map((equipment, i) => {
                if (equipment.equipmentid === equipmentid) {
                    getequipment = equipment;
                }

            })
        }
        return getequipment;
    }



    getEquipmentKey(myuser, equipmentid) {
        let key = false;
        if (myuser.equipment) {
            myuser.equipment.map((equipment, i) => {
                if (equipment.equipmentid === equipmentid) {
                    key = i;
                }

            })
        }
        return key;
    }



    hashPassword(password) {

        return bcrypt.hashSync(password, 10);
    }

    calculateTotalDays(purchasedate, salvagedate) {

        const purchaseDate = new Date(`${purchasedate} 12:00:00${this.getOffsetDate(purchasedate)}`)
        const salvageDate = new Date(`${salvagedate} 12:00:00${this.getOffsetDate(salvagedate)}`)

        const purchasetime = purchaseDate.getTime();
        const salvagetime = salvageDate.getTime();
        const interval = salvagetime - purchasetime
        const days = interval / (1000 * 60 * 60 * 24)
        return Math.round(days)

    }

    increasedatebyoneday(timein) {

        //let timein = '2020/12/31';

        let datein = new Date(timein);
        let newdate = new Date(datein.getTime())
        let day = newdate.getDate();
        let month = newdate.getMonth() + 1;
        let year = newdate.getFullYear();
        if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
            if (day === 31) {
                day = 1;
                if (month !== 12) {
                    month = month + 1;

                }
                else {
                    month = 1;
                    year = year + 1;
                }
            }
            else {
                day = day + 1;

            }

        }

        if (month === 4 || month === 6 || month === 9 || month === 11) {

            if (day === 30) {
                day = 1;
                month = month + 1;
            }
            else {
                day = day + 1;
            }
        }


        if (month === 2) {
            if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) {
                if (day === 29) {
                    day = 1;
                    month = month + 1;
                }
            }
            else {
                if (day === 28) {
                    day = 1;
                    month = month + 1;
                }
                else {
                    day = day + 1
                }
            }

        }

        if (day < 10) {
            day = `0${day}`
        }

        if (month < 10) {
            month = `0${month}`
        }
        return (`${year}/${month}/${day}`)
    }

    calculatetotalhours(timeout, timein) {
        let datein = new Date(timein)
        let dateout = new Date(timeout)
        let totalhours = ((dateout.getTime() - datein.getTime()) / (1000 * 60 * 60))
        return Number(totalhours).toFixed(2);
    }

    makeID(length) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    formatTimeIn(timein) {

        timein = timein.split(' ')
        let date = timein[0]
        let time = timein[1]
        const month = date.split('/')[1]
        const day = date.split('/')[2]
        let minutes = time.split(':')[1]
        let hours = time.split(':')[0];

        let ampm = 'am'
        if (Number(hours) >= 12) {
            ampm = 'pm'
            if (Number(hours) > 12) {
                hours = Number(hours) - 12;


            }
        }
        else if (Number(hours) === 0) {
            hours = 12;
        }

        return `${month}/${day} ${hours}:${minutes} ${ampm}`
    }

    trailingZeros(num) {

        if (num.toString().length === 1) {


            if (Number(num) < 10) {

                return (`0${num}`);
            }
            else {
                return num;
            }

        }
        else {
            return num;
        }

    }

    calculateTotalWeeks(purchasedate, salvagedate) {

        const purchaseDate = new Date(`${purchasedate} 12:00:00${this.getOffsetDate(purchasedate)}`)
        const salvageDate = new Date(`${salvagedate} 12:00:00${this.getOffsetDate(salvagedate)}`)

        const purchasetime = purchaseDate.getTime();
        const salvagetime = salvageDate.getTime();
        const interval = salvagetime - purchasetime
        const weeks = interval / (1000 * 60 * 60 * 24 * 7)
        return Math.floor(weeks)

    }

    increaseDateByOneWeek(timein) {
        const offset = this.getOffsetDate(timein);
        const TimeIn = new Date(`${timein} 12:00:00${offset}`);
        let datetime = TimeIn.getTime();
        datetime += (1000 * 60 * 60 * 24 * 7)
        const oneWeek = new Date(datetime)
        let month = oneWeek.getMonth() + 1;
        month = this.trailingZeros(month)
        let day = oneWeek.getDate();
        day = this.trailingZeros(day)
        const year = oneWeek.getFullYear();
        return (`${year}/${month}/${day}`)


    }

    calculateTotalYears(purchasedate, salvagedate) {
        let totalyears = 0;
        const purchaseyearstr = purchasedate.split('/')
        const purchaseyear = purchaseyearstr[0];
        const purchasemonth = purchaseyearstr[1];
        const purchaseday = purchaseyearstr[2];
        const salvageyearstr = salvagedate.split('/')
        const salvageyear = salvageyearstr[0]
        const salvagemonth = salvageyearstr[1]
        const salvageday = salvageyearstr[2]
        if (purchasemonth >= salvagemonth) {

            if (purchasemonth === salvagemonth) {

                if (purchaseday >= salvageday) {

                    totalyears = salvageyear - purchaseyear - 1

                }
                else {

                    totalyears = salvageyear - purchaseyear


                }


            }



        }
        else {
            totalyears = salvageyear - purchaseyear

        }
        return (totalyears)


    }

    increaseCalendarDaybyOneYear(timein) {

        let datein = new Date(timein)
        let currentYear = datein.getFullYear();
        let increaseYear = currentYear + 1;
        let month = datein.getMonth() + 1;
        let day = datein.getDate();
        if (month < 10) {
            month = `0${month}`
        }
        if (day < 10) {
            day = `0${day}`
        }
        let newDate = `${increaseYear}/${month}/${day}`
        return (newDate)
    }

    getInterval(salvagedate, purchasedate, reoccurring, amount, detail) {


        let period = 0;
        let x = 0;
        let cost = {};
        let costArray = [];
        switch (reoccurring) {
            case 'daily':
                period = this.calculateTotalDays(purchasedate, salvagedate)
                for (x = 0; x < period; x++) {
                    cost = this.newCost(detail, purchasedate, amount)
                    costArray.push(cost)
                    purchasedate = this.increasedatebyoneday(purchasedate)

                }
                break;
            case 'weekly':
                period = this.calculateTotalWeeks(purchasedate, salvagedate)
                for (x = 0; x < period; x++) {
                    cost = this.newCost(detail, purchasedate, amount)
                    costArray.push(cost)
                    purchasedate = this.increaseDateByOneWeek(purchasedate)
                }
                break;
            case 'monthly':
                period = this.calculateTotalMonths(purchasedate, salvagedate)
                for (x = 0; x < period; x++) {
                    cost = this.newCost(detail, purchasedate, amount)
                    costArray.push(cost)
                    purchasedate = this.increaseDateStringByOneMonth(purchasedate)
                }

                break;
            case 'annually':
                period = this.calculateTotalYears(purchasedate, salvagedate)
                for (x = 0; x < period; x++) {
                    cost = this.newCost(detail, purchasedate, amount)
                    costArray.push(cost)
                    purchasedate = this.increaseCalendarDaybyOneYear(purchasedate)
                }

                break;


            default:
                break;


        }

        return costArray



    }

    isEmpty(obj) {
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                return false;
            }
        }
        return true;
    }

    gettransformedcostsbyequiment(equipment) {



        let costarray = [];

        if (equipment) {

            if (equipment.repayment) {
                const purchase = Number(equipment.repayment.purchase);
                const purchasedate = equipment.repayment.purchasedate;
                const salvage = Number(equipment.repayment.salvage);
                const salvagedate = equipment.repayment.salvagedate;
                const apr = Number(equipment.repayment.apr);
                // validate
                const validate = this.validateLoanPayment(purchase, purchasedate, salvage, salvagedate, apr)
                let payments = [];
                if (validate) {
                    payments = this.getRepaymentCosts(purchase, purchasedate, salvage, salvagedate, apr);
                    costarray = [...costarray, ...payments]

                }
                else if (purchase && !apr) {

                    payments = this.getInterval(salvagedate, purchasedate, 'monthly', ((purchase - salvage) / this.calculateTotalMonths(purchasedate, salvagedate)), 'repayment')
                    costarray = [...costarray, ...payments]

                }

            }

            if (equipment.costs) {


                // eslint-disable-next-line
                equipment.costs.map(cost => {



                    if (cost.reoccurring.frequency) {


                        if (equipment.repayment) {


                            const reoccurringcosts = this.getInterval(equipment.repayment.salvagedate, cost.purchasedate, cost.reoccurring.frequency, cost.amount, cost.detail)

                            costarray = [...costarray, ...reoccurringcosts]

                        }


                    }
                    else {

                        let detail = cost.detail;




                        if (cost.recharge) {



                            const hours = Number(cost.recharge.duration.hours) > 0 ? ` ${cost.recharge.duration.hours} hrs ` : "";
                            const minutes = Number(cost.recharge.duration.minutes) > 0 ? ` ${cost.recharge.duration.minutes} minutes` : "";
                            const seconds = Number(cost.recharge.duration.seconds) > 0 ? ` ${cost.recharge.duration.seconds} seconds` : "";
                            const recharge = Number(cost.recharge.totalenergy) > 0 ? ` Total Energy: ${cost.recharge.totalenergy} kWh` : "";
                            detail += recharge
                            if (cost.recharge.duration) {
                                if (Number(cost.recharge.duration.hours) > 0 || Number(cost.recharge.duration.minutes) || Number(cost.recharge.duration.seconds)) {
                                    detail += ` Battery Charge Duration: `
                                }

                            }

                            detail += `${hours}${minutes}${seconds}`


                        }

                        const newCost = this.newCost(detail, cost.purchasedate, cost.amount)

                        costarray.push(newCost)



                    }


                })




            }

        }


        costarray.sort((a, b) => {

            return this.sorttimes(a.purchasedate, b.purchasedate)
        })




        return costarray;


    }


    validateLoanPayment(purchase, purchasedate, salvage, salvagedate, apr) {

        let validate = true;

        if (new Date(purchasedate).getTime() > new Date(salvagedate).getTime()) {

            validate = false;


        }

        if (!Number(apr)) {
            validate = false;

        }

        if (!Number(purchase)) {

            validate = false;

        }

        return validate;


    }

    calculateTotalMonths(purchasedate, salvagedate) {
        //  let purchasedate = '2018/05/24';
        // let saledate = '2025/01/24'
        const datePurchase = new Date(`${purchasedate}`);
        const salvageDate = new Date(`${salvagedate}`);
        const datePurchaseYear = datePurchase.getFullYear();
        const purchaseMonth = datePurchase.getMonth() + 1;
        const salvageDateYear = salvageDate.getFullYear();
        const salvageMonth = salvageDate.getMonth() + 1;
        const yearsinterval = salvageDateYear - datePurchaseYear;
        const monthInterval = salvageMonth - purchaseMonth;
        const totalMonths = (yearsinterval) * 12 + monthInterval;
        return (totalMonths)

    }

    FutureCostPresent(i, n, F) {
        i = ((i / 1200));
        // let F=540;
        // let i=(.058/12);
        // let n = 40;
        return (F * (1 / Math.pow((1 + i), n)))
    }

    AmmortizeFactor(i, n) {
        i = ((i / 1200));
        // let n = 80;

        const num = i * Math.pow((1 + i), n)

        const deno = Math.pow((1 + i), n) - 1;

        const factor = num / deno;

        return factor;
    }

    getOffsetDate(timein) {
        let datein = new Date(`${timein} 00:00:00 UTC `)
        let offset = datein.getTimezoneOffset() / 60
        let sym = "+";
        if (offset > 0) {
            sym = "-";
        }
        if (Math.abs(offset) < 10) {
            offset = `0${offset}`
        }
        return (`${sym}${offset}:00`)
    }

    increaseDateStringByOneMonth(timein) {

        const offset = this.getOffsetDate(timein)

        let datein = new Date(`${timein} 12:00:00${offset}`);
        let month = datein.getMonth() + 1;
        let year = datein.getFullYear();
        if (month === 12) {
            month = 1;
            year = year + 1;
        }
        else {
            month = month + 1;
        }

        let date = datein.getDate();

        if (month < 10) {
            month = `0${month}`;
        }
        date = datein.getDate();
        if (date < 10) {
            date = `0${date}`;
        }

        return (`${year}/${month}/${date}`);
    }
    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    formatDateIn(timein) {
        const datein = new Date(timein)
        const month = datein.getMonth() + 1
        const day = datein.getDate();

        return `${month}/${day}`
    }

    newCost(detail, purchasedate, amount) {

        return ({ detail, purchasedate, amount: Number(amount).toFixed(2) })


    }


    getRepaymentCosts(purchase, purchasedate, salvage, salvagedate, i) {

        // let purchasedate = '2018/05/24'
        // const salvagedate = '2023/05/24'
        // const purchase = '7400'
        // let salvage = '1500'
        // const i = 16;

        const period = this.calculateTotalMonths(purchasedate, salvagedate)

        salvage = this.FutureCostPresent(i, period, salvage)
        const value = purchase - salvage
        const monthlyvalue = value * this.AmmortizeFactor(i, period)
        let costArray = [];
        for (let x = 0; x < period; x++) {

            let cost = this.newCost('repayment', purchasedate, monthlyvalue)

            costArray.push(cost)
            purchasedate = this.increaseDateStringByOneMonth(purchasedate)


        }

        return costArray;
    }

    sorttimes(timeina, timeinb) {
        timeina = new Date(timeina)
        timeinb = new Date(timeinb)

        if (timeina < timeinb) {
            return -1;
        }
        else if (timeinb > timeina) {
            return 1;
        }
        else {
            return 0;
        }
    }

    checkYear(timein, year) {

        // 2020/12/31 21:00:00-08:00
        let check = false;
        const getyear = timein.split('/')[0]
        console.log("getyear", getyear, year)

        if (Number(getyear) === Number(year)) {
            check = true;
        }



        return check;

    }

    getReimbursementByEquipment(myuser, equipmentid, year) {
        const equipment = this.getEquipment(myuser, equipmentid)
        let reimburse = 0;
        if (equipment.costs) {
            equipment.costs.map(cost => {

                if (this.checkYear(cost.purchasedate, year)) {

                    if (cost.reimbursable) {

                        reimburse += Number(cost.amount)

                    }


                }
            })

        }

        return reimburse;
    }

    receiptReport(myuser, year) {

        let receipts = {};
        receipts.year = year;

        const createReceipt = (purchasedate, amount, detail, url) => {
            return ({ purchasedate, amount, detail, url })
        }

        myuser = Object.create(myuser);
        const driver = `${myuser.firstname} ${myuser.lastname}`
        receipts.driver = driver;
        receipts.receipt = [];
        if (myuser.equipment) {
            myuser.equipment.map(equipment => {

                if (equipment.costs) {

                    const sortedCosts = equipment.costs.sort((a, b) => {
                        return this.sorttimes(a.purchasedate, b.purchasedate)
                    })


                    sortedCosts.map(cost => {

                        if (this.checkYear(cost.purchasedate, year)) {

                            const purchasedate = this.formatDateIn(cost.purchasedate);
                            const amount = cost.amount;
                            const detail = cost.detail;

                            if (cost.images) {

                                cost.images.map(image => {
                                    const url = image.url;
                                    const Receipt = createReceipt(purchasedate, amount, detail, url)
                                    receipts.receipt.push(Receipt);




                                })
                            }

                        }



                    })

                }



            })

        }
        return receipts;
    }


    annualReport(myuser, year) {



        console.log(myuser, year)


        const createShift = (timein, timeout, totalhours, deliveries, earnings, miles, frequency) => {

            return ({
                timein,
                timeout,
                totalhours,
                deliveries,
                earnings,
                miles
            })
        }

        const createEquipment = (equipment, salvagedate, salvage, purchasedate, purchase, apr) => {
            return ({

                equipment,
                repayment: {
                    salvagedate,
                    salvage,
                    purchasedate,
                    purchase,
                    apr
                }
            })
        }



        let driver = {

            driverid: myuser.driverid,
            firstname: myuser.firstname,
            lastname: myuser.lastname,
            year,
            totalearnings: 0,
            totalcosts: 0



        }

        // if (myuser.driver) {

        //     driver.shifts = {};
        //     driver.shifts.shift = [];

        //      if (myuser.driver.shifts) {

        //      myuser.driver.shifts.sort((a, b) => {
        //          return this.sorttimes(a.timein, b.timein)
        //      })

        //     myuser.driver.shifts.map(shift => {

        //         if (this.checkYear(shift.timein, year)) {
        //             driver.totalearnings += Number(Number(shift.earnings).toFixed(2))
        //             const newShift = createShift(this.formatTimeIn(shift.timein), this.formatTimeIn(shift.timeout), this.calculatetotalhours(shift.timeout, shift.timein), shift.deliveries, Number(shift.earnings).toFixed(2), shift.miles)
        //             driver.shifts.shift.push(newShift)
        //         }

        //     })

        //     //    }

        // }


        if (myuser.equipment) {
            driver.equipmentlist = {};
            driver.equipmentlist.equipment = [];
            myuser.equipment.map(equipment => {

                const newEquipment = createEquipment(equipment.equipment, equipment.repayment.salvagedate, equipment.repayment.salvage, equipment.repayment.purchasedate, equipment.repayment.purchase, equipment.repayment.apr)
                newEquipment.costs = {};
                const getcost = this.gettransformedcostsbyequiment(equipment);
                let filteredCosts = [];

                getcost.map(cost => {


                    if (this.checkYear(cost.purchasedate, year)) {

                                        driver.totalcosts += Number(Number(cost.amount).toFixed(2))

                                        cost.purchasedate = this.formatDateIn(cost.purchasedate)
                                        filteredCosts.push(cost)

                    }
                })

                        filteredCosts.sort((a, b) => {
                            return this.sorttimes(a.purchasedate, b.purchasedate)
                        })
                        let equipmentcosts = 0;

                        filteredCosts.map(addCost => {
                            equipmentcosts += Number(addCost.amount)
                        })



                        newEquipment.costs.cost = filteredCosts;
                        newEquipment.totalcost = this.numberWithCommas(Number(equipmentcosts).toFixed(2));

                        newEquipment.reimbursement = this.numberWithCommas(Number(this.getReimbursementByEquipment(myuser, equipment.equipmentid, year)).toFixed(2))

                        driver.equipmentlist.equipment.push(newEquipment)


            })



        }

        // driver.totalnet = this.numberWithCommas(Number(Number(driver.totalearnings - driver.totalcosts).toFixed(2)));
        // driver.totalearnings = this.numberWithCommas(Number(driver.totalearnings).toFixed(2))
        // driver.totalcosts = this.numberWithCommas(Number(driver.totalcosts).toFixed(2))

        return driver;

    }




}

module.exports = AppBasedDriver;
