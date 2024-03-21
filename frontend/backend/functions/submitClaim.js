// This function is the endpoint's request handler.
exports = function({ query, headers, body}, response) {

    // Raw request body (if the client sent one).
    // This is a binary object that can be accessed as a string using .text()
    const jsonBody = JSON.parse(body.text());

    jsonBody.handled = false;
    
    return context.services.get("mongodb-atlas").db("vehicle_damage").collection("unhandled_claims").insertOne(jsonBody);
};
