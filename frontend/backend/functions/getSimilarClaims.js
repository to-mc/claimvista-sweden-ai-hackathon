exports = async function({ query, headers, body}, response){
  
  const jsonBody = JSON.parse(body.text())
  const embedding = jsonBody.embedding;
  let skip = 0;
  let limit = 3;
  if(jsonBody.skip){
    skip = jsonBody.skip;
  }
  if(jsonBody.limit){
    limit = jsonBody.limit;
  }
  

  // Find the name of the MongoDB service you want to use (see "Linked Data Sources" tab)
  var serviceName = "mongodb-atlas";

  // Update these to reflect your db/collection
  var dbName = "vehicle_damage";
  var collName = "vehicle_damage";

  // Get a collection from the context
  var collection = context.services.get(serviceName).db(dbName).collection(collName);

  var searchResult;
  
  var pipeline = [
        {
            "$vectorSearch": {
                "index": "default",
                "path": "embedding",
                "queryVector": embedding,
                "numCandidates": 200,
                "limit": limit,
            }
        },
        {
            "$project": {
                "_id": 0,
                "description": 1,
                "severity": 1,
                "title": 1,
                "cost_estimate": 1,
                "image_base64": 1,
                "score": {"$meta": "vectorSearchScore"},
            }
        },
        { "$skip" : skip}
    ]
  
  try {

    // Execute a FindOne in MongoDB 
    searchResult = await collection.aggregate(
      pipeline,
    );

  } catch(err) {
    console.log("Error occurred while executing aggregation:", err.message);

    return { error: err.message };
  }

  // To call other named functions:
  // var result = context.functions.execute("function_name", arg1, arg2);

  return { result: searchResult };
};