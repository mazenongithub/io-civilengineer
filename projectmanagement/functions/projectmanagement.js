class ProjectManagement {

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
