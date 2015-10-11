from app import app, mongo
from flask import request, json, make_response
from bson.objectid import ObjectId

import base64
import bcrypt

from auth import generate_token

@app.route('/api/user', methods=['GET', 'DELETE', 'POST']) # GET + DELETE for debugging only!
def user():

	# This should be the only method that's kept
	if request.method == 'POST':
		if request.headers['Content-Type'] == 'application/json':
			body = request.json

			# Validate email
			email = body['signupEmail']
			email_exists = mongo.app.users.find_one({
				"email" : email
				})
			if email_exists:
				return make_response(json.jsonify({
					"err" : True,
					"typ" : "EmailExists"
					}))

			# Validate password
			if not body['signupPass1'] == body['signupPass2']:
				return make_response(json.jsonify({
					"err" : True,
					"typ" : "PasswordMismatch"
					}), 200)

			# Encode / hash password
			password = body['signupPass1'].encode('utf-8')
			hashed = bcrypt.hashpw(password, bcrypt.gensalt())

			# Write query
			user = {
				"email" : email,
				"password" : hashed.encode('utf-8')
			}

			# Write new accout to DB
			write_result = mongo.app.users.insert(user)

			# Success! Generate and return a JWT
			if isinstance(write_result, ObjectId):
				oid = base64.b64encode(str(write_result))
				token = generate_token({
					"email" : email,
					"oid" : oid
					})
				return make_response(json.jsonify({
					"token" : token,
					}), 200)
			# Not so great, write error
			else:
				return json.jsonify({
					"err" : True,
					"typ" : "MongoWriteError"
					})
		# Only accept JSON
		else:
			return make_response("", 415) # unsupported media type

	# GET all users
	elif request.method == 'GET':

		# GET all users
		cursor = mongo.app.users.find({})

		# Parse and return the body
		body = []
		for item in cursor:
			print(item)
			temp = {}
			for key in item:
				if key == '_id':
					temp['oid'] = base64.b64encode(str(item['_id']))
				else:
					temp[key] = item[key]
			print(temp)
			body.append(temp)
		# return raw json result
		return json.jsonify({
			"results" : body
			})

	# DELETE all users
	elif request.method == 'DELETE':
		drop_result = mongo.app.users.drop()
		return json.jsonify({
			"dropped" : drop_result
			})