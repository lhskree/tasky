from app import app, mongo
from flask import request, json, make_response
from bson.objectid import ObjectId

import base64
import bcrypt
import jwt

@app.route('/login', methods=['POST'])
def login():

	if request.headers['Content-Type'] == 'application/json':
		body = request.json
		password = body['password'].encode('utf-8')
		hashed = bcrypt.hashpw(password, bcrypt.gensalt())
		query = {
			"username" : body['username']
			#"password" : hashed.decode('utf-8')
		}
		cursor = mongo.app.users.find(query)

		for item in cursor:
			for key in item:
				if key == '_id':
					pass
				else:
					body[key] = item[key]
		return json.jsonify(body)