module.exports = (response) => {
    if (response.hasOwnProperty("unconfined")) {
        if (!response.unconfined.test.hasOwnProperty("length")) {
            let test = [];
            test.push(response.unconfined.test);

            response.unconfined.test = test;
        }
    }

    if (response.hasOwnProperty("sampleids")) {

        if (!response.sampleids.sample.hasOwnProperty("length")) {

            let sample = [];
            sample.push(response.sampleids.sample)
            response.sampleids.sample = sample;

        }
    }

    if (response.hasOwnProperty("boringids")) {
        if (!response.boringids.boring.hasOwnProperty("length")) {
            let boring = [];
            boring.push(response.boringids.boring)
            response.boringids.boring = boring;
        }
    }

    if (response.hasOwnProperty("borings")) {
        if (!response.borings.boring.hasOwnProperty("length")) {
            let borings = [];
            borings.push(response.borings.boring)
            response.borings.boring = borings;
        }
        // eslint-disable-next-line
        response.borings.boring.map((boring, i) => {
            if (boring.hasOwnProperty("samples")) {

                if (!boring.samples.sample.hasOwnProperty("length")) {
                    let sample = [];
                    sample.push(boring.samples.sample)
                    response.borings.boring[i].samples.sample = sample;
                }


                // eslint-disable-next-line
                boring.samples.sample.map((sample, j) => {

                    if (sample.hasOwnProperty("unconfined")) {

                        if (!sample.unconfined.testdata.data.hasOwnProperty("length")) {
                            let data = [];
                            data.push(sample.unconfined.testdata.data)
                            response.borings.boring[i].samples.sample[j].unconfined.testdata.data = data;
                        }
                    }
                })
            }


        })
    }
    return response;

}
