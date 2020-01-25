module.exports = (response) => {
    if (response.hasOwnProperty("company")) {
        if (response.company.hasOwnProperty("construction")) {
            let civilengineercode = [];
            let code = [];


            if (response.company.construction.hasOwnProperty("civilengineer")) {
                if (response.company.construction.civilengineer.hasOwnProperty("csicodes")) {
                    if (!response.company.construction.civilengineer.csicodes.code.hasOwnProperty("length")) {

                        civilengineercode.push(response.company.construction.civilengineer.csicodes.code)
                        response.company.construction.civilengineer.csicodes.code = code;
                    }
                }

            }


            if (response.company.construction.hasOwnProperty("csicodes")) {
                if (!response.company.construction.csicodes.code.hasOwnProperty("length")) {
                    code.push(response.company.construction.csicodes.code);
                    response.company.construction.csicodes.code = code;
                }
            }
        }

        if (response.company.hasOwnProperty("office")) {
            let account = [];
            let account_1 = [];
            if (response.company.office.hasOwnProperty("civilengineer")) {
                if (response.company.office.civilengineer.hasOwnProperty("accounts")) {
                    if (!response.company.office.civilengineer.accounts.account.hasOwnProperty("length")) {
                        account.push(response.company.office.civilengineer.accounts.account);
                        response.company.office.civilengineer.accounts.account = account;
                    }
                }
            }

            if (response.company.office.hasOwnProperty("accounts")) {
                if (!response.company.office.accounts.account.hasOwnProperty("length")) {
                    account_1.push(response.company.office.accounts.account);
                    response.company.office.accounts.account = account_1;
                }

            }

            if (response.company.office.hasOwnProperty("employees")) {
                if (!response.company.office.employees.employee.hasOwnProperty("length")) {
                    let employee = [];
                    employee.push(response.company.office.employees.employee);
                    response.company.office.employees.employee = employee;
                }

                response.company.office.employees.employee.map((employee, i) => {
                    if (employee.hasOwnProperty("benefits")) {
                        if (!employee.benefits.benefit.hasOwnProperty("length")) {
                            let mybenefit = [];
                            mybenefit.push(employee.benefits.benefit)
                            response.company.office.employees.employee[i].benefits.benefit = mybenefit;
                        }
                    }
                })
            }

        }

        if (response.company.hasOwnProperty("materials")) {
            if (!response.company.materials.mymaterial.hasOwnProperty("length")) {
                let mymaterial = [];
                mymaterial.push(response.company.materials.mymaterial);
                response.company.materials.mymaterial = mymaterial;
            }
        }

        if (response.company.hasOwnProperty("equipment")) {
            if (!response.company.equipment.myequipment.hasOwnProperty("length")) {
                let myequipment = [];
                myequipment.push(response.company.equipment.myequipment);
                response.company.equipment.myequipment = myequipment;
            }

            // eslint-disable-next-line
            response.company.equipment.myequipment.map((myequipment, i) => {
                console.log(myequipment)
                if (myequipment.hasOwnProperty("ownership")) {
                    if (!myequipment.ownership.cost.hasOwnProperty("length")) {
                        let cost = [];
                        cost.push(myequipment.ownership.cost)
                        response.company.equipment.myequipment[i].ownership.cost = cost
                    }
                }



            })

        }

        if (response.company.hasOwnProperty("projects")) {
            if (!response.company.projects.myproject.hasOwnProperty("length")) {
                let myproject = [];
                myproject.push(response.company.projects.myproject)
                response.company.projects.myproject = myproject;

            }


            // eslint-disable-next-line
            response.company.projects.myproject.map((myproject, i) => {

                if (myproject.hasOwnProperty("projectteam")) {
                    if (!myproject.projectteam.myteam.hasOwnProperty("length")) {
                        let myteam = [];
                        myteam.push(myproject.projectteam.myteam);
                        response.company.projects.myproject[i].projectteam.myteam = myteam;
                    }
                }

                if (myproject.hasOwnProperty("projectmilestones")) {
                    if (!myproject.projectmilestones.mymilestone.hasOwnProperty("length")) {
                        let mymilestone = [];
                        mymilestone.push(myproject.projectmilestones.mymilestone);
                        response.company.projects.myproject[i].projectmilestones.mymilestone = mymilestone;
                    }
                }

                if (myproject.hasOwnProperty("schedulelabor")) {
                    if (!myproject.schedulelabor.mylabor.hasOwnProperty("length")) {
                        let mylabor = [];
                        mylabor.push(myproject.schedulelabor.mylabor);
                        response.company.projects.myproject[i].schedulelabor.mylabor = mylabor;
                    }
                }

                if (myproject.hasOwnProperty("actuallabor")) {
                    if (!myproject.actuallabor.mylabor.hasOwnProperty("length")) {
                        let mylabor = [];
                        mylabor.push(myproject.actuallabor.mylabor);
                        response.company.projects.myproject[i].actuallabor.mylabor = mylabor;
                    }
                }

                if (myproject.hasOwnProperty("schedulematerials")) {
                    if (!myproject.schedulematerials.mymaterial.hasOwnProperty("length")) {
                        let mymaterial = [];
                        mymaterial.push(myproject.schedulematerials.mymaterial);
                        response.company.projects.myproject[i].schedulematerials.mymaterial = mymaterial;
                    }
                }

                if (myproject.hasOwnProperty("actualmaterials")) {
                    if (!myproject.actualmaterials.mymaterial.hasOwnProperty("length")) {
                        let mymaterial = [];
                        mymaterial.push(myproject.actualmaterials.mymaterial);
                        response.company.projects.myproject[i].actualmaterials.mymaterial = mymaterial;
                    }
                }

                if (myproject.hasOwnProperty("scheduleequipment")) {
                    if (!myproject.scheduleequipment.myequipment.hasOwnProperty("length")) {
                        let myequipment = [];
                        myequipment.push(myproject.scheduleequipment.myequipment);
                        response.company.projects.myproject[i].scheduleequipment.myequipment = myequipment
                    }
                }

                if (myproject.hasOwnProperty("actualequipment")) {
                    if (!myproject.actualequipment.myequipment.hasOwnProperty("length")) {
                        let myequipment = [];
                        myequipment.push(myproject.actualequipment.myequipment);
                        response.company.projects.myproject[i].actualequipment.myequipment = myequipment
                    }
                }

                if (myproject.hasOwnProperty("proposals")) {
                    if (!myproject.proposals.myproposal.hasOwnProperty("length")) {
                        let myproposal = [];
                        myproposal.push(myproject.proposals.myproposal);
                        response.company.projects.myproject[i].proposals.myproposal = myproposal;
                    }
                    // eslint-disable-next-line
                    response.company.projects.myproject[i].proposals.myproposal.map((myproposal, j) => {
                        if (myproposal.hasOwnProperty("bidschedule")) {
                            if (!myproposal.bidschedule.biditem.hasOwnProperty("length")) {
                                let biditem = [];
                                biditem.push(myproposal.bidschedule.biditem);
                                response.company.projects.myproject[i].proposals.myproposal[j].bidschedule.biditem = biditem;

                            }
                        }
                    })

                }

                if (myproject.hasOwnProperty("invoices")) {
                    if (!myproject.invoices.myinvoice.hasOwnProperty("length")) {
                        let myinvoice = [];
                        myinvoice.push(myproject.invoices.myinvoice);
                        response.company.projects.myproject[i].invoices.myinvoice = myinvoice;
                    }
                    // eslint-disable-next-line
                    response.company.projects.myproject[i].invoices.myinvoice.map((myinvoice, j) => {
                        if (myinvoice.hasOwnProperty("bid")) {
                            if (!myinvoice.bid.biditem.hasOwnProperty("length")) {
                                let biditem = [];
                                biditem.push(myinvoice.bid.biditem);
                                response.company.projects.myproject[i].invoices.myinvoice[j].bid.biditem = biditem;

                            }
                        }
                    })


                }



            })

        }


    }

    return response;

}
