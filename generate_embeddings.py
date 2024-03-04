import os

import pymongo
from openai import OpenAI

db_user = os.environ.get("ATLAS_USER")
db_pass = os.environ.get("ATLAS_PASS")

client = OpenAI()
mongo_client = pymongo.MongoClient(
    f"mongodb+srv://{db_user}:{db_pass}@hackathon.16xuc.mongodb.net/?retryWrites=true&w=majority&appName=Hackathon"
)


def get_embedding(damage_description):

    response = client.embeddings.create(input=[damage_description], model="text-embedding-ada-002")

    return response


def main():
    db = mongo_client["vehicle_damage"]
    collection = db["vehicle_damage"]

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
