import os

db_user = os.environ.get("ATLAS_USER")
db_pass = os.environ.get("ATLAS_PASS")

db_connection_string = (
    f"mongodb+srv://{db_user}:{db_pass}@hackathon.16xuc.mongodb.net/?retryWrites=true&w=majority&appName=Hackathon"
)
