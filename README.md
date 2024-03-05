# Vehicle Damage Insurance Form

## Running the example

1. Set the appropriate environment variables: `ATLAS_USER`, `ATLAS_PASS`, and `OPENAI_API_KEY`. Update `db_config.py` with the database hostname.
2. Run `describe_images_initial.py`. This will use the gpt-4-vision model to generate a json document for each image in the `./datasets` directory, describing the damage and severity. We'll also include the base64 encoded image, and load the document into MongoDB. Example document:

```json
{
  "title": "Vehicle Front-End Damage",
  "description": "The vehicle has sustained significant damage to the front bumper and headlight assembly. The headlight is broken, and there is visible deformation of the bumper with parts of the material separated and lying on the ground. The paint is scratched, and the body around the headlight is crumpled, indicating a forceful impact in this area.",
  "severity": "high",
  "image_path": "70.jpg",
  "image_base64": "<base64 encoded image>",
  "cost_estimate": 35750,
}
```

3. Run `generate_embeddings.py`. This will generate vector embeddings based on the damage description, and add them to the existing documents in the database under the `embeddings` field. 

4. Create the vector search index with Atlas Search:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 1536,
      "similarity": "euclidean"
    }
  ]
}
```