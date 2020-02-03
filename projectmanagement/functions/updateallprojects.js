module.exports = (response) => {
    //ensures allprojeccts are arrays
    if (response.hasOwnProperty("projects")) {
        if (!response.projects.myproject.hasOwnProperty("length")) {
            let myproject = [];
            myproject.push(response.projects.myproject)
            response.projects.myproject = myproject;
        }

        if (response.projects.myproject.hasOwnProperty("length")) {
            // eslint-disable-next-line
            response.projects.myproject.map((myproject, i) => {


                if (myproject.hasOwnProperty("projectmilestones")) {

                    if (!myproject.projectmilestones.mymilestone.hasOwnProperty("length")) {
                        let mymilestone = [];
                        mymilestone.push(response.projects.myproject[i].projectmilestones.mymilestone)

                        response.projects.myproject[i].projectmilestones.mymilestone = mymilestone;
                    }
                }

                if (myproject.hasOwnProperty("projectteam")) {

                    if (!myproject.projectteam.myteam.hasOwnProperty("length")) {
                        let myteam = [];
                        myteam.push(response.projects.myproject[i].projectteam.myteam)

                        response.projects.myproject[i].projectteam.myteam = myteam;
                    }
                }
                if (myproject.hasOwnProperty("schedulelabor")) {
                    if (!myproject.schedulelabor.mylabor.hasOwnProperty("length")) {
                        let mylabor = [];
                        mylabor.push(myproject.schedulelabor.mylabor)
                        response.projects.myproject[i].schedulelabor.mylabor = mylabor;
                    }
                }
                if (myproject.hasOwnProperty("actuallabor")) {
                    if (!myproject.actuallabor.mylabor.hasOwnProperty("length")) {
                        let mylabor = [];
                        mylabor.push(myproject.actuallabor.mylabor)
                        response.projects.myproject[i].actuallabor.mylabor = mylabor;
                    }
                }
                if (myproject.hasOwnProperty("schedulematerials")) {
                    if (!myproject.schedulematerials.mymaterial.hasOwnProperty("length")) {
                        let mymaterial = [];
                        mymaterial.push(myproject.schedulematerials.mymaterial)
                        response.projects.myproject[i].schedulematerials.mymaterial = mymaterial;
                    }
                }

                if (myproject.hasOwnProperty("actualmaterials")) {
                    if (!myproject.actualmaterials.mymaterial.hasOwnProperty("length")) {
                        let mymaterial = [];
                        mymaterial.push(myproject.actualmaterials.mymaterial)
                        response.projects.myproject[i].actualmaterials.mymaterial = mymaterial;
                    }
                }

                if (myproject.hasOwnProperty("scheduleequipment")) {
                    if (!myproject.scheduleequipment.myequipment.hasOwnProperty("length")) {
                        let myequipment = [];
                        myequipment.push(myproject.scheduleequipment.myequipment)
                        response.projects.myproject[i].scheduleequipment.myequipment = myequipment;
                    }
                }

                if (myproject.hasOwnProperty("actualequipment")) {
                    if (!myproject.actualequipment.myequipment.hasOwnProperty("length")) {
                        let myequipment = [];
                        myequipment.push(myproject.actualequipment.myequipment)
                        response.projects.myproject[i].actualequipment.myequipment = myequipment;
                    }
                }

                if (myproject.hasOwnProperty("proposals")) {
                    if (!myproject.proposals.myproposal.hasOwnProperty("length")) {
                        let myproposal = [];
                        myproposal.push(myproject.proposals.myproposal)
                        response.projects.myproject[i].proposals.myproposal = myproposal;

                        // esline-disable-next-line
                        response.projects.myproject[i].proposals.myproposal.map((myproposal, j) => {
                            if (myproposal.hasOwnProperty("bidschedule")) {
                                if (!myproposal.bidschedule.biditem.hasOwnProperty("length")) {
                                    let biditem = [];
                                    biditem.push(myproposal.bidschedule.biditem)
                                    response.projects.myproject[i].proposals.myproposal[j].bidschedule.biditem = biditem;
                                }

                            }

                        })
                    }
                }
                if (myproject.hasOwnProperty("invoices")) {
                    if (!myproject.invoices.myinvoice.hasOwnProperty("length")) {
                        let myinvoice = [];
                        myinvoice.push(myproject.invoices.myinvoice)
                        response.projects.myproject[i].invoices.myinvoice = myinvoice;

                        response.projects.myproject[i].invoices.myinvoice.map((myinvoice, j) => {
                            if (myinvoice.hasOwnProperty("bid")) {
                                if (!myinvoice.bid.biditem.hasOwnProperty("length")) {
                                    let biditem = [];
                                    biditem.push(myinvoice.bid.biditem)
                                    response.projects.myproject[i].invoices.myinvoice[j].bid.biditem = biditem;
                                }

                            }

                        })
                    }
                }


            })

        }
    }

    return response;
}
