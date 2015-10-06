from app import app, mongo
from flask import request, json
from bson.objectid import ObjectId

import base64

@app.route('/login', methods=['POST'])
def login():

	return true