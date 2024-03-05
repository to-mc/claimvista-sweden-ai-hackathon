import os

import pymongo
from openai import AzureOpenAI

from db_config import db_connection_string

client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version="2023-12-01-preview",
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
)
deployment_name = "text-embedding-ada-002"

mongo_client = pymongo.MongoClient(db_connection_string)
db = mongo_client["vehicle_damage"]
collection = db["vehicle_damage"]


def get_embedding(damage_description):
    """Get the vector embedding for the damage description."""
    response = client.embeddings.create(input=[damage_description], model=deployment_name)
    return response


def main():
    """Generate embeddings for the damage descriptions."""
    for document in collection.find():
        embedding = document.get("embedding")
        if not embedding:
            damage_description = document["description"]
            embedding = get_embedding(damage_description)
            embedding = embedding.data[0].embedding
            collection.update_one({"_id": document["_id"]}, {"$set": {"embedding": embedding}})
            print(embedding)
        print(f"Embedding for {document['image_path']} already exists. Skipping.")


if __name__ == "__main__":
    main()
