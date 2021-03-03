class ProjectManagement {

    validateSettlement(settlement) {
        let validate = "";
        let pendingtransfers = 0;
        let scheduledtransfers = 0;
        let chargeamount = 0;
        if (Object.create(settlement.charges)) {
            settlement.charges.map(charge => {
                chargeamount += Number(charge.amount);
            })
        }
        if (Object.create(settlement).accounts) {

            settlement.accounts.map(account => {


                if (Object.create(account.pendingtransfers)) {
                    account.pendingtransfers.map(transfer => {
                        pendingtransfers += Number(transfer.amount);
                    })
                }

                if (Object.create(account.scheduledtransfers)) {
                    account.scheduledtransfers.map(transfer => {
                        scheduledtransfers += Number(transfer.amount)
                    })
                }

            })
        }
        const available = chargeamount - scheduledtransfers;
        if (pendingtransfers > available) {
            validate = `Your pending transfers ${pendingtransfers} exceeds the amount ${available} available. Please add more money to your account `
        }
        return validate;

    }

    getTransferAmountbyAcct(invoice, stripe) {

        let amount = 0;
        if (invoice.hasOwnProperty("labor")) {

            invoice.labor.map(mylabor => {
                if (Object.create(mylabor).scheduletransfers) {
                    mylabor.scheduletransfers.map(transfer => {
                        if (transfer.stripe === stripe) {
                            amount += Number(transfer.amount)


                        }


                    })



                }


            })

        }

        if (Object.create(invoice).materials) {

            invoice.materials.map(material => {

                if (material.stripe === stripe) {

                    if (Object.create(material).scheduletransfers) {
                        material.scheduletransfers.map(transfer => {
                            amount += Number(transfer.amount)



                        })




                    }




                }



            })


        }

        if (Object.create(invoice).equipment) {

            invoice.equipment.map(equipment => {

                if (equipment.stripe === stripe) {

                    if (Object.create(equipment).scheduletransfers) {

                        equipment.scheduletransfers.map(transfer => {
                            amount += Number(transfer.amount)



                        })



                    }



                }


            })



        }

        return amount;

    }

    checkTransfers(transfers, stripe) {
        let check = true
        transfers.map(transfer => {
            if (transfer.stripe === stripe) {

                check = false

            }

        })

        return check;

    }


    getTransfersFromInvoice(invoice) {

        let transfers = [];
        if (Object.create(invoice).equipment) {

            invoice.equipment.map(equipment => {
                let stripe = equipment.stripe;
                if (this.checkTransfers(transfers, stripe)) {
                    let amount = this.getTransferAmountbyAcct(invoice, stripe)
                    transfers.push({ stripe, amount })

                }

            })


        }

        if (Object.create(invoice).materials) {
            invoice.materials.map(material => {
                let stripe = material.stripe;
                if (this.checkTransfers(transfers, stripe)) {

                    let amount = this.getTransferAmountbyAcct(invoice, stripe)
                    transfers.push({ stripe, amount })
                }


            })

        }

        if (Object.create(invoice).labor) {

            invoice.labor.map(mylabor => {

                if (Object.create(mylabor).scheduletransfers) {

                    mylabor.scheduletransfers.map(transfer => {
                        let stripe = transfer.stripe;
                        if (this.checkTransfers(transfers, stripe)) {

                            let amount = this.getTransferAmountbyAcct(invoice, stripe)
                            transfers.push({ stripe, amount })

                        }


                    })



                }


            })



        }



        return transfers
    }
}


module.exports = ProjectManagement
