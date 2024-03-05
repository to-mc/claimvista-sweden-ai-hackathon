import base64
import json
import os
import random

import pymongo
from openai import AzureOpenAI

from db_config import db_connection_string

client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version="2023-12-01-preview",
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
)
deployment_name = "gpt-4-vision"

mongo_client = pymongo.MongoClient(db_connection_string)
db = mongo_client["vehicle_damage"]
collection = db["vehicle_damage"]


def encode_image(image_path):
    """Encode the image as a base64 string."""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def process_image(base64_image):
    """Process the image using the OpenAI API and return the response as a JSON object."""
    response = client.chat.completions.create(
        model=deployment_name,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Can you describe the damage to the vehicle, including a title and the severity (categorized as low, medium or high)? Please return json instead of text. The json structure should use the headings 'title', 'description', and 'severity'.",
                    },
                    {
                        "type": "image_url",
                        "image_url": f"data:image/jpeg;base64,{base64_image}",
                    },
                ],
            }
        ],
        max_tokens=1000,
    )
    resp_json = json.loads(response.choices[0].message.content.replace("json\n", "").replace("`", ""))
    resp_json["severity"] = resp_json["severity"].lower()
    return resp_json


def estimate_cost(severity):
    """Estimate the cost of the damage based on the severity."""
    if severity == "low":
        return random.randint(500, 2500)
    elif severity == "medium":
        return random.randint(2500, 10000)
    else:
        return random.randint(1000, 100000)


def image_exists(image_path):
    """Check if the image already exists in the database."""
    doc = collection.find_one({"image_path": image_path})
    return bool(doc)


def main():
    """Main function to process the images and store the data in the database."""
    images = os.listdir("./dataset")
    for image_path in images:
        if image_exists(image_path):
            print(f"Image {image_path} already exists in the database")
        else:
            relative_path = os.path.join("./dataset", image_path)
            base64_image = encode_image(relative_path)
            image_data = process_image(base64_image)
            image_data["image_path"] = image_path
            image_data["image_base64"] = base64_image
            image_data["cost_estimate"] = estimate_cost(image_data["severity"])
            collection.insert_one(image_data)
            print(image_data)


if __name__ == "__main__":
    main()
