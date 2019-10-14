module.exports = (response) => {
    if (response) {
        if (response.hasOwnProperty("projects")) {

            console.log(response)



            if (!response.projects.project.hasOwnProperty("length")) {

                let projectArray = [];
                projectArray.push(response.projects.project)
                response.projects.project = projectArray;
            }


            // eslint-disable-next-line
            response.projects.project.map((myproject, i) => {
                if (myproject.hasOwnProperty(("fieldreports"))) {
                    if (!myproject.fieldreports.fieldreport.hasOwnProperty("length")) {
                        let fieldreport = [];
                        fieldreport.push(myproject.fieldreports.fieldreport);
                        response.projects.project[i].fieldreports.fieldreport = fieldreport;
                    }
                    // eslint-disable-next.line
                    myproject.fieldreports.fieldreport.map((fieldreport, j) => {
                        if (fieldreport.hasOwnProperty("compactiontests")) {
                            if (!fieldreport.compactiontests.compactiontest.hasOwnProperty("length")) {
                                let compactiontest = [];
                                compactiontest.push(fieldreport.compactiontests.compactiontest);
                                response.projects.project[i].fieldreports.fieldreport[j].compactiontests.compactiontest = compactiontest
                            }

                        }

                        if (fieldreport.hasOwnProperty("compactioncurves")) {
                            if (!fieldreport.compactioncurves.compactioncurve.hasOwnProperty("length")) {
                                let compactioncurve = [];
                                compactioncurve.push(fieldreport.compactioncurves.compactioncurve);
                                response.projects.project[i].fieldreports.fieldreport[j].compactioncurves.compactioncurve = compactioncurve
                            }

                        }
                    })
                }
                if (myproject.hasOwnProperty("borings")) {

                    if (!myproject.borings.boring.hasOwnProperty("length")) {
                        let boringArray = [];
                        boringArray.push(myproject.borings.boring)
                        response.projects.project[i].borings.boring = boringArray;
                    }
                    // eslint-disable-next-line
                    response.projects.project[i].borings.boring.map((boring, j) => {

                        if (boring.hasOwnProperty("boringdata")) {
                            console.log(boring.boringdata)
                            if (!boring.boringdata.data.hasOwnProperty("length")) {
                                let data = [];
                                data.push(boring.boringdata.data);

                                response.projects.project[i].borings.boring[j].boringdata.data = data
                            }
                        }

                        if (boring.hasOwnProperty("graphics")) {
                            if (!boring.graphics.graphic.hasOwnProperty("length")) {
                                let graphic = [];
                                graphic.push(boring.graphics.graphic)
                                response.projects.project[i].borings.boring[j].graphics.graphic = graphic;
                            }
                        }

                    })


                }
                if (myproject.hasOwnProperty("letters")) {
                    if (!myproject.letters.letter.hasOwnProperty("length")) {
                        let letter = [];
                        letter.push(myproject.letters.letter)
                        response.projects.project[i].letters.letter = letter;

                    }

                    // eslint-disable-next-line
                    myproject.letters.letter.map((letter, j) => {
                        if (letter.hasOwnProperty("references")) {
                            if (!letter.references.reference.hasOwnProperty("length")) {
                                let reference = [];
                                reference.push(letter.references.reference)
                                response.projects.project[i].letters.letter[j].references.reference = reference;
                            }
                        }

                        if (letter.hasOwnProperty("body")) {
                            if (!letter.body.section.hasOwnProperty("length")) {
                                let section = [];
                                section.push(letter.body.section)
                                response.projects.project[i].letters.letter[j].body.section = section;
                            }
                        }

                        if (letter.hasOwnProperty("compactiontests")) {
                            if (!letter.compactiontests.compactiontest.hasOwnProperty("length")) {
                                let compactiontest = [];
                                compactiontest.push(letter.compactiontests.compactiontest)
                                response.projects.project[i].letters.letter[j].compactiontests.compactiontest = compactiontest;
                            }
                        }

                        if (letter.hasOwnProperty("compactioncurves")) {
                            if (!letter.compactioncurves.compactioncurve.hasOwnProperty("length")) {
                                let compactioncurve = [];
                                compactioncurve.push(letter.compactioncurves.compactioncurve)
                                response.projects.project[i].letters.letter[j].compactioncurves.compactioncurve = compactioncurve;
                            }
                        }
                    })
                }

                if (myproject.hasOwnProperty("scheduleitems")) {

                    if (!myproject.scheduleitems.scheduleitem.hasOwnProperty("length")) {
                        let scheduleitem = [];

                        scheduleitem.push(myproject.scheduleitems.scheduleitem)
                        console.log(scheduleitem)
                        response.projects.project[i].scheduleitems.scheduleitem = scheduleitem
                    }
                }
                if (myproject.hasOwnProperty("actualitems")) {

                    if (!myproject.actualitems.actualitem.hasOwnProperty("length")) {
                        let actualitem = [];

                        actualitem.push(myproject.actualitems.actualitem)

                        response.projects.project[i].actualitems.actualitem = actualitem
                    }
                }


                if (myproject.hasOwnProperty("events")) {
                    if (!myproject.events.event.hasOwnProperty("length")) {
                        let event = [];
                        event.push(myproject.events.event)
                        response.projects.project[i].events.event = event

                    }
                }

                if (myproject.hasOwnProperty("invoices")) {
                    if (!myproject.invoices.invoice.hasOwnProperty("length")) {
                        let invoice = [];
                        invoice.push(myproject.invoices.invoice);
                        response.projects.project[i].invoices.invoice = invoice;
                    }
                }

                if (myproject.hasOwnProperty("actualmaterials")) {
                    if (!myproject.actualmaterials.actualmaterial.hasOwnProperty("length")) {
                        let actualmaterial = [];
                        actualmaterial.push(myproject.actualmaterials.actualmaterial);
                        response.projects.project[i].actualmaterials.actualmaterial = actualmaterial;
                    }
                }
            })
        }

    }
    return response;
};
