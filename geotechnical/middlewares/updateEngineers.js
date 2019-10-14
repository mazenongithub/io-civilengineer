module.exports = (response) => {

    if (response.hasOwnProperty("engineers")) {
        if (!response.engineers.engineer.hasOwnProperty("length")) {
            let engineer = [];
            engineer.push(response.engineers.engineer);
            response.engineers.engineer = engineer;
        }

        response.engineers.engineer.map((engineer, i) => {
            if (engineer.hasOwnProperty("scheduleitems")) {
                if (!engineer.scheduleitems.scheduleitem.hasOwnProperty("length")) {
                    let scheduleitem = [];
                    scheduleitem.push(engineer.scheduleitems.scheduleitem)
                    response.engineers.engineer[i].scheduleitems.scheduleitem = scheduleitem;
                }
            }

            if (engineer.hasOwnProperty("benefits")) {
                if (!engineer.benefits.benefit.hasOwnProperty("length")) {
                    let benefit = [];
                    benefit.push(engineer.benefits.benefit)
                    response.engineers.engineer[i].benefits.benefit = benefit;
                }
            }
        })


    }

    return response;
};
