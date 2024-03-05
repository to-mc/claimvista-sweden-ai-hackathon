// This function is the endpoint's request handler.
exports = function({ query, headers, body}, response) {


    // Raw request body (if the client sent one).
    // This is a binary object that can be accessed as a string using .text()
    const searchTerm = body.text();


    const pipeline = [
  {
    '$search': {
      'index': 'findClaim', 
      'text': {
        'query': searchTerm, 
        'path': 'description'
      }
    }
  }, {
    '$match': {
      'embedding': {
        '$exists': true
      }
    }
  },{
    '$limit': 5
  }
];
    // Querying a mongodb service:
    return context.services.get("mongodb-atlas").db("vehicle_damage").collection("vehicle_damage").aggregate(pipeline);

};
