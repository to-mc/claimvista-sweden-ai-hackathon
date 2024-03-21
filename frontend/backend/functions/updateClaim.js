exports = function({ query, headers, body}, response) {
    // Parse the request body to JSON
    const jsonBody = JSON.parse(body.text());
    
    // Assuming the object ID is sent under the key 'id' in the JSON body
    const objectId = jsonBody.id;
    
    
    // Prepare the filter criteria and update operation
    const filter = { _id: BSON.ObjectId(objectId) };
    const update = { $set: { handled: true } };
    
    // Perform the update operation
    return context.services.get("mongodb-atlas").db("vehicle_damage").collection("unhandled_claims").updateOne(filter, update)
};
