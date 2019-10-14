module.exports = (response) => {
    if (response.hasOwnProperty("projectcosts")) {
        if (response.projectcosts.hasOwnProperty("actuallabor")) {
            if (!response.projectcosts.actuallabor.mylabor.hasOwnProperty("length")) {
                let mylabor = [];
                mylabor.push(response.projectcosts.actuallabor.mylabor);
                response.projectcosts.actuallabor.mylabor = mylabor;
            }
        }

        if (response.projectcosts.hasOwnProperty("actualmaterials")) {
            if (!response.projectcosts.actualmaterials.mymaterial.hasOwnProperty("length")) {
                let mymaterial = [];
                mymaterial.push(response.projectcosts.actualmaterials.mymaterial);
                response.projectcosts.actualmaterials.mymaterial = mymaterial;
            }
        }

    }
    return response;
}
