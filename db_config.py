import os

db_user = os.environ.get("ATLAS_USER")
db_pass = os.environ.get("ATLAS_PASS")
db_host = os.environ.get("ATLAS_HOST")


db_connection_string = (
    f"mongodb+srv://{db_user}:{db_pass}@{db_host}/?retryWrites=true&w=majority&appName=Hackathon"
)
