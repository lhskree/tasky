from app import app, mongo
from flask import request, json, make_response
from bson.objectid import ObjectId

import base64
import bcrypt

from auth import generate_token

# the API for logging in
@app.route('/api/login', methods=['POST'])
def login():

	if request.method == 'POST':
		if request.headers['Content-Type'] == 'application/json':
			body = request.json

			# Validate email
			email = body['email']
			print(email)
			user = mongo.app.users.find_one({
				"email" : email
				})

			if user:
				password = body['password'].encode('utf-8')
				hashed = user['password'].encode('utf-8')
				if bcrypt.hashpw(password, hashed) == hashed:
					oid = base64.b64encode(str(user['_id']))
					token = generate_token({
						"email" : email,
						"oid" : oid
						})
					return make_response(json.jsonify({
						"token" : token,
						}), 200)
			return make_response("", 401) # Unauthorized
		# Only accept JSON
		else:
			return make_response("", 415) # unsupported media type