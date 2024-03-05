exports = async function ({ query, headers, body }, response) {
  // Find the name of the MongoDB service you want to use (see "Linked Data Sources" tab)
  var serviceName = "mongodb-atlas";

  // Update these to reflect your db/collection
  var dbName = "vehicle_damage";
  var collName = "vehicle_damage";

  // Get a collection from the context
  var collection = context.services.get(serviceName).db(dbName).collection(collName);
  
  var searchResult;
  
    /* Vector search */
    let embeddings;
  await context.services.get(serviceName).db(dbName).collection("vehicle_damage").findOne({})
  .then(result => {
    if(result) {
      console.log(`Successfully found document: ${result}.`);
      embeddings = result.embedding
      console.log(embeddings)
    } else {
      console.log("No document matches the provided query.");
    }
    return result;
  })
  .catch(err => console.error(`Failed to find document: ${err}`));
  console.log(embeddings);
  
  var pipeline = [
        {
            "$vectorSearch": {
                "index": "default",
                "path": "embedding",
                "queryVector": embeddings,
                "numCandidates": 200,
                "limit": 3,
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
    ]
    
  try {

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
