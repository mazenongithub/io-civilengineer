module.exports = (response) => {
    //ensures allprojeccts are arrays
    let updatedprojects = [];
    //ensures allarrayvalues are updated
    let superupdatedprojects = [];
    if (response.hasOwnProperty("myproject")) {
        updatedprojects.push(response.myproject)



        //already confirmed to be an array;
        updatedprojects.map(myproject => {

            //update the project
            if (myproject.hasOwnProperty("projectmilestones")) {

                if (!myproject.projectmilestones.mymilestone.hasOwnProperty("length")) {
                    let mymilestone = [];
                    mymilestone.push(myproject.projectmilestones.mymilestone)
                    myproject.projectmilestones.mymilestone = mymilestone;
                }
            }
            if (myproject.hasOwnProperty("projectteam")) {
                if (!myproject.projectteam.myteam.hasOwnProperty("length")) {
                    let myteam = [];
                    myteam.push(myproject.projectteam.myteam);
                    myproject.projectteam.myteam = myteam;
                }

            }
            if (myproject.projectschedule.hasOwnProperty("schedulelabor")) {
                if (!myproject.projectschedule.schedulelabor.mylabor.hasOwnProperty("length")) {
                    let mylabor = [];
                    mylabor.push(myproject.projectschedule.schedulelabor.mylabor);
                    myproject.projectschedule.schedulelabor.mylabor = mylabor;
                }

            }
            if (myproject.projectschedule.hasOwnProperty("schedulematerials")) {
                if (!myproject.projectschedule.schedulematerials.mymaterial.hasOwnProperty("length")) {
                    let mymaterial = [];
                    mymaterial.push(myproject.projectschedule.schedulematerials.mymaterial);
                    myproject.projectschedule.schedulematerials.mymaterial = mymaterial;
                }
            }
            if (myproject.projectcosts.hasOwnProperty("actuallabor")) {
                if (!myproject.projectcosts.actuallabor.mylabor.hasOwnProperty("length")) {
                    let mylabor = [];
                    mylabor.push(myproject.projectcosts.actuallabor.mylabor);
                    myproject.projectcosts.actuallabor.mylabor = mylabor;
                }
            }
            if (myproject.projectcosts.hasOwnProperty("actualmaterials")) {
                if (!myproject.projectcosts.actualmaterials.mymaterial.hasOwnProperty("length")) {
                    let mymaterial = [];
                    mymaterial.push(myproject.projectcosts.actualmaterials.mymaterial);
                    myproject.projectcosts.actualmaterials.mymaterial = mymaterial;
                }
            }
            if (myproject.hasOwnProperty("proposals")) {
                if (!myproject.proposals.myproposal.hasOwnProperty("length")) {

                    let myproposal = [];
                    myproposal.push(myproject.proposals.myproposal);
                    myproject.proposals.myproposal = myproposal;

                }

                
            }

            if (myproject.hasOwnProperty("invoices")) {
                if (!myproject.invoices.myinvoice.hasOwnProperty("length")) {
                    let myinvoice = [];
                    myinvoice.push(myproject.invoices.myinvoice)
                    myproject.invoices.myinvoice = myinvoice;
                }
            }


            superupdatedprojects.push(myproject);
            //end updateproject

        })

    } //obj passed has to have the property of myproject

    return superupdatedprojects;
}
