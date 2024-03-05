exports = async function ({ query, headers, body }, response) {
  
  const azureOpenAIKey = context.values.get("azure-openai-key")
  const azureOpenAIEndpoint = context.values.get("azure-endpoint")
  const azureVisionModelName = "gpt-4-vision"
  const azureEmbeddingsModelName = "text-embedding-ada-002"
  const azureURL = `${azureOpenAIEndpoint}/openai/deployments/${azureVisionModelName}/chat/completions/?api-version=2023-12-01-preview`
  const azureEmbeddingsURL = `${azureOpenAIEndpoint}/openai/deployments/${azureEmbeddingsModelName}/embeddings/?api-version=2023-05-15`
  
  // Find the name of the MongoDB service you want to use (see "Linked Data Sources" tab)
  var serviceName = "mongodb-atlas";

  // Update these to reflect your db/collection
  var dbName = "vehicle_damage";
  var collName = "vehicle_damage";

  // Get a collection from the context
  var collection = context.services.get(serviceName).db(dbName).collection(collName);
  var searchResult

  const base64Image = JSON.parse(body.text());
  
  console.log(base64Image)

  const headersOpenAPI = {
    "Content-Type": ["application/json"],
    "api-key": [
      azureOpenAIKey,
    ],
  };

  // Open API  Payload for describing the Image that user uploaded.
  const payload = {
    max_tokens: 300,
    stream:false,
    messages: [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Can you describe the damage to the vehicle, including a title and the severity (categorized as low, medium or high)? Please return json instead of text. The json structure should use the headings 'title', 'description', and 'severity'.",
                    },
                    {
                        "type": "image_url",
                        "image_url": {"url": `data:image/jpeg;base64,${base64Image}`}
                    },
                ],
            }
        ],
  };

  // Make the API request to OpenAI, to describe the image
  const openAPIResponse = await context.http.post({
    url: azureURL,
    headers: headersOpenAPI,
    body: JSON.stringify(payload),
  });

  var dataImageDescription = "";
  var dataImageSeverity = "";
  var dataImageTitle = "";
  var dataEmbeddings = "";
  if (openAPIResponse.statusCode === 200) {
    
    const responseBody = JSON.parse(openAPIResponse.body.text())
    console.log(JSON.stringify(responseBody))
    const parsedResponse = JSON.parse(responseBody.choices[0].message.content.replace("json\n", "").replace(/`/g, ""))
    dataImageDescription = parsedResponse.description;
    dataImageSeverity = parsedResponse.severity.toLowerCase();
    dataImageTitle = parsedResponse.title
    
    
    
    const embeddingsPayload = {
      input: dataImageDescription
      };
    // Make Request to generate embeding for description
    const openAPIDescriptionEmbeddingsResponse = await context.http.post({
      url: azureEmbeddingsURL,
      headers: headersOpenAPI,
      body: embeddingsPayload,
      encodeBodyAsJSON: true,
    });
    dataEmbeddings = JSON.parse(
      openAPIDescriptionEmbeddingsResponse.body.text()
    );
    console.log(JSON.stringify(dataEmbeddings))
    var parsed_embedding = dataEmbeddings.data[0].embedding

    
  
    /* Vector search */

    var pipeline = [
      {
        "$vectorSearch": {
          "index": "default",
          "path": "embedding",
          "queryVector": parsed_embedding,
          "numCandidates": 200,
          "limit": 3,
        },
      },
      {
        "$project": {
          "_id": 0,
          "description": 1,
          "severity": 1,
          "score": { "$meta": "vectorSearchScore" },
          "cost_estimate": 1
        },
      },
    ];
    
    try {
      searchResult = await collection.aggregate(pipeline).toArray();
    } catch(err) {
          console.log("Error occurred while executing aggregation:", err.message);

    return { error: err.message };
    }
    
    

  } else {
    throw new Error(
      `Failed to get description from OpenAI. Response: ${openAPIResponse.body.text()}`
    );
  }
  
    //get average cost_estimate of similar claims
  const avg_cost_estimate = searchResult.map((item) => item.cost_estimate).reduce((accumulator, currentValue) => accumulator + currentValue, 0) / searchResult.length

  
  // Respond to the request indicating success
  response.setStatusCode(200);
  response.setBody(
    JSON.stringify({
      message: "Image processed and description generated successfully",
      description: dataImageDescription,
      title: dataImageTitle,
      severity: dataImageSeverity,
      embeddings: parsed_embedding,
      cost_estimate: avg_cost_estimate,
    })
  );
};
