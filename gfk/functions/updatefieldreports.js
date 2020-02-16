module.exports = (response) => {
    if (response.hasOwnProperty("reports")) {
        if (!response.reports.fieldreport.hasOwnProperty("length")) {
            let fieldreport = [];
            fieldreport.push(response.reports.fieldreport);
            response.reports.fieldreport = fieldreport;
        }
    }
    if (response.hasOwnProperty("compactiontests")) {
        if (!response.compactiontests.compactiontest.hasOwnProperty("length")) {
            let compactiontest = [];
            compactiontest.push(response.compactiontests.compactiontest);
            response.compactiontests.compactiontest = compactiontest;
        }

    }
    if (response.hasOwnProperty("fieldreports")) {
        if (!response.fieldreports.fieldreport.hasOwnProperty("length")) {
            let fieldreport = [];
            fieldreport.push(response.fieldreports.fieldreport);
            response.fieldreports.fieldreport = fieldreport;
        }

        // eslint-disable-next-line
        response.fieldreports.fieldreport.map((report, i) => {

            if (report.hasOwnProperty("images")) {
                if (!report.images.image.hasOwnProperty("length")) {
                    let image = [];
                    image.push(report.images.image);
                    response.fieldreports.fieldreport[i].images.image = image;
                }
            }

            if (report.hasOwnProperty("compactiontests")) {
                if (!report.compactiontests.compactiontest.hasOwnProperty("length")) {
                    let compactiontest = [];
                    compactiontest.push(report.compactiontests.compactiontest);
                    response.fieldreports.fieldreport[i].compactiontests.compactiontest = compactiontest;
                }
            }

        })
    }
    return response;

}
