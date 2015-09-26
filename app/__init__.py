from flask import Flask
from pymongo import MongoClient

app = Flask(__name__)
mongo = MongoClient('localhost', 27017)

import routes