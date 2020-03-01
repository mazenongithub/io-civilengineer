module.exports = (response) => {
    if (response.hasOwnProperty("images")) {
        if (!response.images.image.hasOwnProperty("length")) {
            let image = [];
            image.push(response.images.image)
            response.images.image = image;
        }
    }
    if (response.hasOwnProperty("fieldreports")) {
        if (!response.fieldreports.fieldreport.hasOwnProperty("length")) {
            let fieldreport = [];
            fieldreport.push(response.fieldreports.fieldreport)
            response.fieldreports.fieldreport = fieldreport;
        }
    }
    if (response.hasOwnProperty("samples")) {
        if (!response.samples.sample.hasOwnProperty("length")) {
            let sample = [];
            sample.push(response.samples.sample)
            response.samples.sample = sample;
        }
    }

    if (response.hasOwnProperty("borings")) {
        if (!response.borings.boring.hasOwnProperty("length")) {
            let boring = [];
            boring.push(response.borings.boring)
            response.borings.boring = boring;
        }
    }
    if (response.hasOwnProperty("unconfinedtests")) {
        if (!response.unconfinedtests.unconfined.hasOwnProperty("length")) {
            let unconfined = [];
            unconfined.push(response.unconfinedtests.unconfined)
            response.unconfinedtests.unconfined = unconfined;
        }
        // eslint-disable-next-line
        response.unconfinedtests.unconfined.map((unconfines, i) => {
            if (unconfines.hasOwnProperty("testdata")) {
                if (!unconfines.testdata.data.hasOwnProperty("length")) {
                    let data = [];
                    data.push(unconfines.testdata.data)
                    response.unconfinedtests.unconfined[i].testdata.data = data;
                }
            }
        })
    }
    return response;

}
