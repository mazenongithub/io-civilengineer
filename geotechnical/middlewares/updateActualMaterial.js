module.exports = (response) => {
    if (response.hasOwnProperty("actualmaterials")) {
        if (!response.actualmaterials.actualmaterial.hasOwnProperty("actualmaterial")) {
            let actualmaterial = [];
            actualmaterial.push(response.actualmaterials.actualmaterial);
            response.actualmaterials.actualmaterial = actualmaterial;
        }
    }
    return response;
};
