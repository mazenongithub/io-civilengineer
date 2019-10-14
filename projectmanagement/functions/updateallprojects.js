module.exports = (response) => {
    //ensures allprojeccts are arrays
    if (response.hasOwnProperty("projectsmanaging")) {
        if (!response.projectsmanaging.myproject.hasOwnProperty("length")) {
            let myproject = [];
            myproject.push(response.projectsmanaging.myproject)
            response.projectsmanaging.myproject = myproject;
        }

        if (response.projectsmanaging.myproject.hasOwnProperty("length")) {
            // eslint-disable-next-line
            response.projectsmanaging.myproject.map((myproject, i) => {


                if (myproject.hasOwnProperty("projectmilestones")) {

                    if (!myproject.projectmilestones.mymilestone.hasOwnProperty("length")) {
                        let mymilestone = [];
                        mymilestone.push(response.projectsmanaging.myproject[i].projectmilestones.mymilestone)

                        response.projectsmanaging.myproject[i].projectmilestones.mymilestone = mymilestone;
                    }
                }

                if (myproject.hasOwnProperty("projectteam")) {

                    if (!myproject.projectteam.myteam.hasOwnProperty("length")) {
                        let myteam = [];
                        myteam.push(response.projectsmanaging.myproject[i].projectteam.myteam)

                        response.projectsmanaging.myproject[i].projectteam.myteam = myteam;
                    }
                }
                if (myproject.hasOwnProperty("schedulelabor")) {
                    if (!myproject.schedulelabor.mylabor.hasOwnProperty("length")) {
                        let mylabor = [];
                        mylabor.push(myproject.schedulelabor.mylabor)
                        response.projectsmanaging.myproject[i].schedulelabor.mylabor = mylabor;
                    }
                }
                if (myproject.hasOwnProperty("actuallabor")) {
                    if (!myproject.actuallabor.mylabor.hasOwnProperty("length")) {
                        let mylabor = [];
                        mylabor.push(myproject.actuallabor.mylabor)
                        response.projectsmanaging.myproject[i].actuallabor.mylabor = mylabor;
                    }
                }
                if (myproject.hasOwnProperty("schedulematerials")) {
                    if (!myproject.schedulematerials.mymaterial.hasOwnProperty("length")) {
                        let mymaterial = [];
                        mymaterial.push(myproject.schedulematerials.mymaterial)
                        response.projectsmanaging.myproject[i].schedulematerials.mymaterial = mymaterial;
                    }
                }

                if (myproject.hasOwnProperty("actualmaterials")) {
                    if (!myproject.actualmaterials.mymaterial.hasOwnProperty("length")) {
                        let mymaterial = [];
                        mymaterial.push(myproject.actualmaterials.mymaterial)
                        response.projectsmanaging.myproject[i].actualmaterials.mymaterial = mymaterial;
                    }
                }

                if (myproject.hasOwnProperty("proposals")) {
                    if (!myproject.proposals.myproposal.hasOwnProperty("length")) {
                        let myproposal = [];
                        myproposal.push(myproject.proposals.myproposal)
                        response.projectsmanaging.myproject[i].proposals.myproposal = myproposal;
                    }
                }
                if (myproject.hasOwnProperty("invoices")) {
                    if (!myproject.invoices.myinvoice.hasOwnProperty("length")) {
                        let myinvoice = [];
                        myinvoice.push(myproject.invoices.myinvoice)
                        response.projectsmanaging.myproject[i].invoices.myinvoice = myinvoice;
                    }
                }


            })

        }
    }

    if (response.hasOwnProperty("projectsprovider")) {
        if (!response.projectsprovider.myproject.hasOwnProperty("length")) {
            let myproject = [];
            myproject.push(response.projectsprovider.myproject)
            response.projectsprovider.myproject = myproject;
        }
        // eslint-disable-next-line
        response.projectsprovider.myproject.map((myproject, i) => {
            if (myproject.hasOwnProperty("projectmilestones")) {
                if (!myproject.projectmilestones.mymilestone.hasOwnProperty("length")) {
                    let mymilestone = [];
                    mymilestone.push(myproject.projectmilestones.mymilestone)
                    response.projectsprovider.myproject[i].projectmilestones.mymilestone = mymilestone
                }
            }
            if (myproject.hasOwnProperty("schedulelabor")) {
                if (!myproject.schedulelabor.mylabor.hasOwnProperty("length")) {
                    let mylabor = [];
                    mylabor.push(myproject.schedulelabor.mylabor)
                    response.projectsprovider.myproject[i].schedulelabor.mylabor = mylabor;
                }
            }
            if (myproject.hasOwnProperty("actuallabor")) {
                if (!myproject.actuallabor.mylabor.hasOwnProperty("length")) {
                    let mylabor = [];
                    mylabor.push(myproject.actuallabor.mylabor)
                    response.projectsprovider.myproject[i].actuallabor.mylabor = mylabor;
                }
            }
            if (myproject.hasOwnProperty("schedulematerials")) {
                if (!myproject.schedulematerials.mymaterial.hasOwnProperty("length")) {
                    let mymaterial = [];
                    mymaterial.push(myproject.schedulematerials.mymaterial)
                    response.projectsprovider.myproject[i].schedulematerials.mymaterial = mymaterial;
                }
            }
            if (myproject.hasOwnProperty("actualmaterials")) {
                if (!myproject.actualmaterials.mymaterial.hasOwnProperty("length")) {
                    let mymaterial = [];
                    mymaterial.push(myproject.actualmaterials.mymaterial)
                    response.projectsprovider.myproject[i].actualmaterials.mymaterial = mymaterial;
                }
            }


            if (myproject.hasOwnProperty("projectteam")) {
                if (!myproject.projectteam.myteam.hasOwnProperty("length")) {
                    let myteam = [];
                    myteam.push(myproject.projectteam.myteam)
                    response.projectsprovider.myproject[i].projectteam.myteam = myteam;
                }
            }

            if (myproject.hasOwnProperty("proposals")) {
                if (!myproject.proposals.myproposal.hasOwnProperty("length")) {
                    let myproposal = [];
                    myproposal.push(myproject.proposals.myproposal)
                    response.projectsprovider.myproject[i].proposals.myproposal = myproposal;
                }
            }

            if (myproject.hasOwnProperty("invoices")) {
                if (!myproject.invoices.myinvoice.hasOwnProperty("length")) {
                    let myinvoice = [];
                    myinvoice.push(myproject.invoices.myinvoice)
                    response.projectsprovider.myproject[i].invoices.myinvoice = myinvoice;
                }
            }
        })

    }


    //End of failure check

    return response;
}
