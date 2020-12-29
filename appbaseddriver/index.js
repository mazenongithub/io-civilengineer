const mongoose = require("mongoose")
const request = require("request")
const keys = require("./keys")
const checkuser = require("./functions/checkuser");

module.exports = app => {


    const DriverSchema = new mongoose.Schema({
        driverid: String,
        google: String,
        apple: String,
        firstname: String,
        lastname: String,
        emailaddress: String,
        profileurl: String,
        phonenumber: String,
        equipment: [{
            equipmentid: String,
            equipment: String,
            repayment: {
                salvagedate: String,
                salvage: String,
                purchasedate: String,
                purchase: String,
                apr: String
            },
            costs: [{
                costid: String,
                detail: String,
                purchasedate: String,
                amount: String
            }],
        }],
        driver: {
            shifts: [{
                shiftid: String,
                timein: String,
                timeout: String,
                deliveries: String,
                earnings: String,
                miles: String,
                reoccurring: {
                    frequency: String
                }
            }]
        }





    });

    const mydriver = mongoose.model("appbaseddrivers", DriverSchema);

    app.post('/appbaseddriver/:driverid/savedriver', (req, res) => {

        const driverid = req.params.driverid;
        //const myuser = req.body.myuser;
        const myuser = {
            "_id": {
                "$oid": "5feb5c1c9e68d8a40062dbf6"
            },
            "driverid": "mazen",
            "firstname": "Mazen",
            "lastname": "Khenaisser",
            "emailaddress": "mazen@civilengineer.io",
            "phonenumber": "9168231652",
            "apple": "000353.66d2a1610de24944b898df602ab5e7a7.0305",
            "profileurl": null,
            "equipment": [{
                "_id": {
                    "$oid": "5fdba186ac90700017561045"
                },
                "repayment": {
                    "purchasedate": "2018/05/23",
                    "purchase": "7400",
                    "salvagedate": "2023/05/24",
                    "salvage": "1000",
                    "apr": "16"
                },
                "equipmentid": "RX077ZXXGX8QAEX3",
                "equipment": "Ford Fusion",
                "costs": [{
                    "_id": {
                        "$oid": "5fdba1b4ac90700017561047"
                    },
                    "costid": "YHPOE0ACC07N458Z",
                    "purchasedate": "2020/06/23",
                    "detail": "Tires",
                    "amount": "748.46"
                }, {
                    "_id": {
                        "$oid": "5fdc873aac90700017561056"
                    },
                    "costid": "RWQ068P3ZWDGGBDC",
                    "purchasedate": "2020/12/18",
                    "detail": "December Gas",
                    "amount": "332.89"
                }, {
                    "_id": {
                        "$oid": "5fe0faea06e8ac00179b3f57"
                    },
                    "costid": "MRQRSQH77KKP00NO",
                    "detail": "Fuel Neck Replacement",
                    "purchasedate": "2020/12/20",
                    "amount": "420.98"
                }, {
                    "_id": {
                        "$oid": "5fea25f38649190017185a10"
                    },
                    "costid": "J4VDYOAJIVS62KZ1",
                    "detail": "Car Insurance",
                    "purchasedate": "2018/05/24",
                    "amount": "100"
                }]
            }, {
                "_id": {
                    "$oid": "5fea156386491900171859ab"
                },
                "repayment": {
                    "purchasedate": "2020/12/28",
                    "purchase": "0",
                    "salvagedate": "2020/12/28",
                    "salvage": "0",
                    "apr": "0"
                },
                "equipmentid": "UKNK8ZBH7U70IE3R",
                "equipment": "Verizon",
                "costs": [{
                    "_id": {
                        "$oid": "5fea156386491900171859ac"
                    },
                    "costid": "5Y1LLVXWDXH7KEH5",
                    "detail": "Verizon Apr-Dec  ",
                    "purchasedate": "2020/12/28",
                    "amount": "668.32"
                }, {
                    "_id": {
                        "$oid": "5fea156386491900171859ad"
                    },
                    "costid": "B1VXVZPQ6UJHLKLW",
                    "detail": "Verizon Contract Upgrade Taxes Fees",
                    "purchasedate": "2020/12/28",
                    "amount": "267.57"
                }]
            }],
            "__v": {
                "$numberInt": "0"
            },
            "driver": {
                "shifts": [{
                    "_id": {
                        "$oid": "5fe677986d2ed9001706e218"
                    },
                    "shiftid": "EVONLVWCA77HG2K1",
                    "timein": "2020/04/28 00:00:00-07:00",
                    "timeout": "2020/04/29 00:20:00-07:00",
                    "earnings": "469.37",
                    "deliveries": "49",
                    "miles": "340"
                }, {
                    "_id": {
                        "$oid": "5fe677986d2ed9001706e219"
                    },
                    "shiftid": "GJ5K5RPEF0X8VQB3",
                    "timein": "2020/05/05 00:00:00-07:00",
                    "timeout": "2020/05/06 08:20:00-07:00",
                    "earnings": "614.13",
                    "deliveries": "64",
                    "miles": "480"
                }, {
                    "_id": {
                        "$oid": "5fe679606d2ed9001706e260"
                    },
                    "shiftid": "5ASNMHZBRQ55FK1Z",
                    "timein": "2020/05/12 00:00:00-07:00",
                    "timeout": "2020/05/13 11:39:00-07:00",
                    "earnings": "733.37",
                    "deliveries": "77",
                    "miles": "540"
                }, {
                    "_id": {
                        "$oid": "5fe679606d2ed9001706e261"
                    },
                    "shiftid": "IG1CJUKBUSVNIR45",
                    "timein": "2020/05/19 00:00:00-07:00",
                    "timeout": "2020/05/19 20:46:00-07:00",
                    "earnings": "388.2",
                    "deliveries": "42",
                    "miles": "290"
                }, {
                    "_id": {
                        "$oid": "5fe679606d2ed9001706e262"
                    },
                    "shiftid": "Y11AGCG34IYMDTVK",
                    "timein": "2020/05/26 00:00:00-07:00",
                    "timeout": "2020/05/26 06:50:00-07:00",
                    "earnings": "122.51",
                    "deliveries": "9",
                    "miles": "90"
                }, {
                    "_id": {
                        "$oid": "5fe67c966d2ed9001706e2af"
                    },
                    "shiftid": "GDQ6W8LBLFIA7PMF",
                    "timein": "2020/06/02 00:00:00-07:00",
                    "timeout": "2020/06/02 04:37:00-07:00",
                    "earnings": "86.54",
                    "deliveries": "9",
                    "miles": "60"
                }, {
                    "_id": {
                        "$oid": "5fe67c966d2ed9001706e2b0"
                    },
                    "shiftid": "YAHHE7QQUYEGXG4O",
                    "timein": "2020/06/09 00:00:00-07:00",
                    "timeout": "2020/06/09 05:02:00-07:00",
                    "earnings": "95",
                    "deliveries": "10",
                    "miles": "67"
                }, {
                    "_id": {
                        "$oid": "5fe67c966d2ed9001706e2b1"
                    },
                    "shiftid": "5FNAXQ20M2TG05EU",
                    "timein": "2020/06/16 00:00:00-07:00",
                    "timeout": "2020/06/16 08:50:00-07:00",
                    "earnings": "167.74",
                    "deliveries": "18",
                    "miles": "118"
                }, {
                    "_id": {
                        "$oid": "5fe67c966d2ed9001706e2b2"
                    },
                    "shiftid": "QQZDEI8NKKXMSG9E",
                    "timein": "2020/06/23 00:00:00-07:00",
                    "timeout": "2020/06/23 10:23:00-07:00",
                    "earnings": "193.26",
                    "deliveries": "21",
                    "miles": "136"
                }, {
                    "_id": {
                        "$oid": "5fe67cf96d2ed9001706e2dd"
                    },
                    "shiftid": "71J6PRSD6X61RTMF",
                    "timein": "2020/06/30 00:00:00-07:00",
                    "timeout": "2020/07/01 02:20:00-07:00",
                    "earnings": "492.08",
                    "deliveries": "54",
                    "miles": "346"
                }, {
                    "_id": {
                        "$oid": "5fe67cf96d2ed9001706e2de"
                    },
                    "shiftid": "GPA225ZJJJEH58Q4",
                    "timein": "2020/07/07 00:00:00-07:00",
                    "timeout": "2020/07/07 17:48:00-07:00",
                    "earnings": "336.75",
                    "deliveries": "37",
                    "miles": "237"
                }, {
                    "_id": {
                        "$oid": "5fe67cf96d2ed9001706e2df"
                    },
                    "shiftid": "MI0SQHZFMGT04CJL",
                    "timein": "2020/07/14 00:00:00-07:00",
                    "timeout": "2020/07/14 22:20:00-07:00",
                    "earnings": "422.94",
                    "deliveries": "46",
                    "miles": "297"
                }, {
                    "_id": {
                        "$oid": "5fe67da06d2ed9001706e30d"
                    },
                    "shiftid": "BH0M2BKX2V1LX3XR",
                    "timein": "2020/07/21 00:00:00-07:00",
                    "timeout": "2020/07/22 13:15:00-07:00",
                    "earnings": "708.43",
                    "deliveries": "77",
                    "miles": "498"
                }, {
                    "_id": {
                        "$oid": "5fe5d7e68a41b30017350114"
                    },
                    "shiftid": "67R6724S97CQJUFC",
                    "timein": "2020/07/27 09:00:00-07:00",
                    "timeout": "2020/07/28 17:55:00-07:00",
                    "earnings": "760.74",
                    "deliveries": "75",
                    "miles": "530"
                }, {
                    "_id": {
                        "$oid": "5fe67da06d2ed9001706e30e"
                    },
                    "shiftid": "T8JCXURVU4QBIW3X",
                    "timein": "2020/07/28 00:00:00-07:00",
                    "timeout": "2020/07/29 09:55:00-07:00",
                    "earnings": "641.17",
                    "deliveries": "71",
                    "miles": "470"
                }, {
                    "_id": {
                        "$oid": "5fe5d7e68a41b30017350115"
                    },
                    "shiftid": "CNXF9NR0H5WC76O0",
                    "timein": "2020/08/03 09:00:00-07:00",
                    "timeout": "2020/08/04 16:16:00-07:00",
                    "earnings": "666.85",
                    "deliveries": "62",
                    "miles": "469"
                }, {
                    "_id": {
                        "$oid": "5fe5d8618a41b30017350126"
                    },
                    "shiftid": "QBWJ57DPD2V3SBHN",
                    "timein": "2020/08/10 09:00:00-07:00",
                    "timeout": "2020/08/12 16:16:00-07:00",
                    "earnings": "836.42",
                    "deliveries": "88",
                    "miles": "588"
                }, {
                    "_id": {
                        "$oid": "5fe6306c8a41b30017350138"
                    },
                    "shiftid": "0IITYLG2X93X1MF2",
                    "timein": "2020/08/17 21:00:00-07:00",
                    "timeout": "2020/08/18 12:02:00-07:00",
                    "earnings": "583.45",
                    "deliveries": "53",
                    "miles": "400"
                }, {
                    "_id": {
                        "$oid": "5fe630de8a41b3001735014b"
                    },
                    "shiftid": "VGHXJ4FEJWYLNPDF",
                    "timein": "2020/08/24 09:00:00-07:00",
                    "timeout": "2020/08/25 13:22:00-07:00",
                    "earnings": "573.69",
                    "deliveries": "59",
                    "miles": "370"
                }, {
                    "_id": {
                        "$oid": "5fe631598a41b3001735015f"
                    },
                    "shiftid": "6QH8KLOQEJ8CXDXJ",
                    "timein": "2020/09/07 09:00:00-07:00",
                    "timeout": "2020/09/08 10:37:00-07:00",
                    "earnings": "473.07",
                    "deliveries": "55",
                    "miles": "370"
                }, {
                    "_id": {
                        "$oid": "5fe684666d2ed9001706e33e"
                    },
                    "shiftid": "FOPPLXGD1PDT9PD3",
                    "timein": "2020/09/08 00:00:00-07:00",
                    "timeout": "2020/09/08 15:15:00-07:00",
                    "earnings": "285.62",
                    "deliveries": "31",
                    "miles": "201"
                }, {
                    "_id": {
                        "$oid": "5fe6672f6d2ed9001706e136"
                    },
                    "shiftid": "YXIIUUUCWE73HO65",
                    "timein": "2020/09/14 00:00:00-07:00",
                    "timeout": "2020/09/14 15:40:00-07:00",
                    "earnings": "280.50",
                    "deliveries": "32",
                    "miles": "170"
                }, {
                    "_id": {
                        "$oid": "5fe6672f6d2ed9001706e137"
                    },
                    "shiftid": "E11G7HEFF048A9PX",
                    "timein": "2020/09/21 00:00:00-07:00",
                    "timeout": "2020/09/21 22:18:00-07:00",
                    "earnings": "417.56",
                    "deliveries": "46",
                    "miles": "285"
                }, {
                    "_id": {
                        "$oid": "5fe668186d2ed9001706e14e"
                    },
                    "shiftid": "DK3C31L5MLHCT7NM",
                    "timein": "2020/09/28 00:00:00-07:00",
                    "timeout": "2020/09/29 20:01:00-07:00",
                    "earnings": "933.10",
                    "deliveries": "90",
                    "miles": "580"
                }, {
                    "_id": {
                        "$oid": "5fe668af6d2ed9001706e166"
                    },
                    "shiftid": "WTFOLLY2YKLKSFMF",
                    "timein": "2020/10/05 00:00:00-07:00",
                    "timeout": "2020/10/05 20:22:00-07:00",
                    "earnings": "356.20",
                    "deliveries": "47",
                    "miles": "250"
                }, {
                    "_id": {
                        "$oid": "5fe669ad6d2ed9001706e17f"
                    },
                    "shiftid": "GWMQIF38YAAQ2L5J",
                    "timein": "2020/10/19 00:00:00-07:00",
                    "timeout": "2020/10/20 03:29:00-07:00",
                    "earnings": "503.29",
                    "deliveries": "53",
                    "miles": "380"
                }, {
                    "_id": {
                        "$oid": "5fe684666d2ed9001706e33f"
                    },
                    "shiftid": "VX2HUVTP4SWTHGJB",
                    "timein": "2020/10/20 00:00:00-07:00",
                    "timeout": "2020/10/21 15:25:00-07:00",
                    "earnings": "521.34",
                    "deliveries": "58",
                    "miles": "370"
                }, {
                    "_id": {
                        "$oid": "5fe669f16d2ed9001706e199"
                    },
                    "shiftid": "Q5HELNX8FMIIO940",
                    "timein": "2020/10/26 00:00:00-07:00",
                    "timeout": "2020/10/27 22:27:00-07:00",
                    "earnings": "942.57",
                    "deliveries": "91",
                    "miles": "620"
                }, {
                    "_id": {
                        "$oid": "5fe66b036d2ed9001706e1b4"
                    },
                    "shiftid": "A12KARFCFVDC655H",
                    "timein": "2020/11/02 00:00:00-08:00",
                    "timeout": "2020/11/03 03:28:00-08:00",
                    "earnings": "530.02",
                    "deliveries": "51",
                    "miles": "350"
                }, {
                    "_id": {
                        "$oid": "5fe66b036d2ed9001706e1b5"
                    },
                    "shiftid": "7ODIRU2EB7FYIU3Q",
                    "timein": "2020/11/09 00:00:00-08:00",
                    "timeout": "2020/11/10 02:35:00-08:00",
                    "earnings": "479.38",
                    "deliveries": "54",
                    "miles": "300"
                }, {
                    "_id": {
                        "$oid": "5fe66b036d2ed9001706e1b6"
                    },
                    "shiftid": "899049UQ0XSY38BN",
                    "timein": "2020/11/16 00:00:00-08:00",
                    "timeout": "2020/11/16 16:51:00-08:00",
                    "earnings": "250.18",
                    "deliveries": "33",
                    "miles": "180"
                }, {
                    "_id": {
                        "$oid": "5fe66b8b6d2ed9001706e1d4"
                    },
                    "shiftid": "O6EWFQPGTXJCMXKW",
                    "timein": "2020/11/23 00:00:00-08:00",
                    "timeout": "2020/11/24 03:45:00-08:00",
                    "earnings": "454.50",
                    "deliveries": "52",
                    "miles": "300"
                }, {
                    "_id": {
                        "$oid": "5fe66b8b6d2ed9001706e1d5"
                    },
                    "shiftid": "BNIZ40852JIUNGZY",
                    "timein": "2020/11/30 00:00:00-08:00",
                    "timeout": "2020/12/01 15:31:00-08:00",
                    "earnings": "747.95",
                    "deliveries": "99",
                    "miles": "350"
                }, {
                    "_id": {
                        "$oid": "5fe673d16d2ed9001706e1f5"
                    },
                    "shiftid": "TNNGNU1M1PU2PJ7E",
                    "timein": "2020/12/07 00:00:00-08:00",
                    "timeout": "2020/12/08 04:30:00-08:00",
                    "earnings": "670.98",
                    "deliveries": "89",
                    "miles": "490"
                }, {
                    "_id": {
                        "$oid": "5fe673d16d2ed9001706e1f6"
                    },
                    "shiftid": "6INH579F8D2MIZYK",
                    "timein": "2020/12/15 13:05:00-08:00",
                    "timeout": "2020/12/15 19:28:00-08:00",
                    "earnings": "124.16",
                    "deliveries": "20",
                    "miles": "95"
                }, {
                    "_id": {
                        "$oid": "5fe3941447858100170a62c0"
                    },
                    "shiftid": "7Q1R1TZNRNCVF8G1",
                    "timein": "2020/12/16 12:30:00-08:00",
                    "timeout": "2020/12/16 18:15:00-08:00",
                    "earnings": "133.15",
                    "deliveries": "15",
                    "miles": "104"
                }, {
                    "_id": {
                        "$oid": "5fe3941447858100170a62c1"
                    },
                    "shiftid": "CGT8NSK5NCEJ6UD9",
                    "timein": "2020/12/17 12:30:00-08:00",
                    "timeout": "2020/12/17 18:15:00-08:00",
                    "earnings": "154.25",
                    "deliveries": "17",
                    "miles": "111.3"
                }, {
                    "_id": {
                        "$oid": "5fe3941447858100170a62c2"
                    },
                    "shiftid": "DAXCM21NYIAE0ZTS",
                    "timein": "2020/12/18 15:26:00-08:00",
                    "timeout": "2020/12/18 18:43:00-08:00",
                    "earnings": "132.17",
                    "deliveries": "11",
                    "miles": "94"
                }, {
                    "_id": {
                        "$oid": "5fe3941447858100170a62c3"
                    },
                    "shiftid": "WWA9FLWW99NJUJUB",
                    "timein": "2020/12/21 11:55:00-08:00",
                    "timeout": "2020/12/21 19:35:00-08:00",
                    "earnings": "217.98",
                    "deliveries": "21",
                    "miles": "111"
                }, {
                    "_id": {
                        "$oid": "5fe3941447858100170a62c4"
                    },
                    "shiftid": "CZ9YEMAOH3DB2PLV",
                    "timein": "2020/12/22 12:30:00-08:00",
                    "timeout": "2020/12/22 20:20:00-08:00",
                    "earnings": "219.92",
                    "deliveries": "21",
                    "miles": "132"
                }, {
                    "_id": {
                        "$oid": "5fe4096547858100170a62f5"
                    },
                    "shiftid": "P9TPWZ41YP2I04Q8",
                    "timein": "2020/12/23 12:20:00-08:00",
                    "timeout": "2020/12/23 19:05:00-08:00",
                    "earnings": "191.46",
                    "deliveries": "15",
                    "miles": "104"
                }, {
                    "_id": {
                        "$oid": "5fe5ccef8a41b300173500f7"
                    },
                    "shiftid": "8TQU4R8Z0NJ7DR3S",
                    "timein": "2020/12/24 14:08:00-08:00",
                    "timeout": "2020/12/24 16:10:00-08:00",
                    "earnings": "62.22",
                    "deliveries": "4",
                    "miles": "33"
                }, {
                    "_id": {
                        "$oid": "5fe907048649190017185974"
                    },
                    "shiftid": "B4QT4DNWUA8ZO4UU",
                    "timein": "2020/12/26 18:01:00-08:00",
                    "timeout": "2020/12/26 20:50:00-08:00",
                    "earnings": "114.2",
                    "deliveries": "8",
                    "miles": "70"
                }, {
                    "_id": {
                        "$oid": "5fea25f38649190017185a0b"
                    },
                    "shiftid": "90WBZ6SD010T1YYI",
                    "timein": "2020/12/27 16:48:00-08:00",
                    "timeout": "2020/12/27 20:26:00-08:00",
                    "earnings": "123",
                    "deliveries": "11",
                    "miles": "66"
                }]
            }
        }
        const filter = { _id: myuser._id }

        const options = {
            strict: false,
            new: true,
            upsert: true,
            useFindAndModify: false
        }

        mydriver.findByIdAndUpdate(filter, myuser, options, function(err, succ) {

            if (err) {
                console.log(err);
            }
            else {
                res.send(succ);
            }
        });

    });



    app.post('/appbaseddriver/clientlogin', (req, res) => {

        if (req.body.type === 'login') {


            let filter = {};
            if (req.body.google) {
                filter = { google: req.body.google }

            }
            else if (req.body.apple) {
                filter = { apple: req.body.apple };

            }


            mydriver.findOne(filter, (err, succ) => {

                if (succ) {

                    req.session.appbaseddriver = succ._id;

                    res.send(succ)
                }

                else {

                    let errmsg = "";
                    if (filter.hasOwnProperty("apple")) {
                        errmsg = `Apple Client Not Registered. Please Register your account `
                    }
                    else if (filter.hasOwnProperty("google")) {

                        errmsg = `Google Client Not Registered. Please Register your account `
                    }
                    res.status(404).send({ message: errmsg })
                }

            })

        }

        else if (req.body.type === 'register') {

            const { driverid, firstname, lastname, emailaddress, phonenumber, apple, google, profileurl } = req.body
            const newdriver = new mydriver({ driverid, firstname, lastname, emailaddress, phonenumber, apple, google, profileurl })

            mydriver.create(newdriver, function(err, succ) {
                if (succ) {
                    req.session.appbaseddriver = succ._id;
                    res.send(succ)
                }
                else {
                    res.status(404).send({ message: `Could not register user ${err}` })
                }
            });

        }


    })



    app.get('/appbaseddriver/:driverid/logout', checkuser, (req, res) => {
        req.session.destroy();
        res.send({
            "message": `${req.params.driverid} has been logged out`
        })

    })


    app.get('/appbaseddriver/:emailaddress/checkemailaddress', checkuser, (req, res) => {

        const driverid = req.session.appbaseddriver;
        mydriver.findById({ _id: driverid }, function(err, succ) {
            if (succ) {
                console.log(succ.emailaddress, req.params.emailaddress)
                if (succ.emailaddress === req.params.emailaddress) {
                    res.send({ valid: req.params.emailaddress })
                }
                else {
                    mydriver.findOne({ emailaddress: req.params.emailaddress }, function(err_1, succ_1) {
                        if (succ_1) {
                            res.send({ invalid: `${req.params.emailaddress} is taken` })

                        }
                        else {
                            res.send({ valid: `${req.params.emailaddress}` })

                        }
                    })


                }

            }

        })



    })


    app.get('/appbaseddriver/:driverid/checkdriverid', (req, res) => {

        if (req.session.hasOwnProperty("user")) {
            if (req.session.hasOwnProperty("appbaseddriver")) {
                const driverid = req.session.appbaseddriver;
                mydriver.findById({ _id: driverid }, function(err, succ) {
                    if (succ) {
                        if (succ.driverid === req.params.driverid) {
                            res.send({ valid: req.params.driverid })
                        }
                        else {
                            mydriver.findOne({ driverid: req.params.driverid }, function(err_1, succ_1) {
                                if (succ_1) {
                                    res.send({ invalid: `${req.params.driverid} is taken` })

                                }
                                else {
                                    res.send({ valid: `${req.params.driverid}` })

                                }
                            })


                        }

                    }

                })

            }


        }
        else {
            mydriver.findOne({ driverid: req.params.driverid }, function(err_2, succ_2) {
                if (succ_2) {
                    res.send({ invalid: `${req.params.driverid} is taken` })

                }
                else {
                    res.send({ valid: `${req.params.driverid}` })

                }
            })
        }



    })


    app.get('/appbaseddriver/checkuser', (req, res) => {
        const driverid = '5feb5a90f538232558b39bd5';
        // const driverid = req.session.appbaseddriver;

        mydriver.findById({ _id: driverid }, function(err, succ) {
            if (succ) {

                res.send(succ)

            }
            else {

                res.status(404).send({ message: ` Please Login In to Access AppBasedDriver` });
            }

        })



    })



}
