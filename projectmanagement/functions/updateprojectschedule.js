module.exports = (response) => {
    if (response.hasOwnProperty("projectschedule")) {
        if (response.projectschedule.hasOwnProperty("schedulelabor")) {
            if (!response.projectschedule.schedulelabor.mylabor.hasOwnProperty("length")) {
                let mylabor = [];
                mylabor.push(response.projectschedule.schedulelabor.mylabor);
                response.projectschedule.schedulelabor.mylabor = mylabor;
            }
        }

        if (response.projectschedule.hasOwnProperty("schedulematerials")) {
            if (!response.projectschedule.schedulematerials.mymaterial.hasOwnProperty("length")) {
                let mymaterial = [];
                mymaterial.push(response.projectschedule.schedulematerials.mymaterial);
                response.projectschedule.schedulematerials.mymaterial = mymaterial;
            }
        }

    }
    return response;
}
