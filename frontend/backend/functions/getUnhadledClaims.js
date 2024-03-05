// This function is the endpoint's request handler.
exports = function({ query, headers, body}, response) {
   
    return(context.services.get("mongodb-atlas").db("vehicle_damage").collection("unhandled_claims").find({}));
};
