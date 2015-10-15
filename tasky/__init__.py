from flask import Flask
from pymongo import MongoClient

app = Flask(__name__)
mongo = MongoClient('localhost', 27017)

# PLZ REPLACE ME WITH A PRIVATE KEY THANKS FAM
# plus env var
app.secret = "dankMemes"

import routes