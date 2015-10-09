from app import app, mongo
from flask import request, json, make_response
from bson.objectid import ObjectId

import base64
import bcrypt

from auth import generate_token

@app.route('/api/user', methods=['GET', 'DELETE', 'POST']) # GET + DELETE for debugging only!
def user():

	if request.method == 'POST':
		if request.headers['Content-Type'] == 'application/json':
			body = request.json
			# Validate username - check for uniqueness
			# Validate password
			# pass to bytes
			if not body['signupPass1'] == body['signupPass2']:
				return False # another error response
			email = body['signupEmail']
			password = body['signupPass1'].encode('utf-8')
			hashed = bcrypt.hashpw(password, bcrypt.gensalt())
			user = {
				"email" : email,
				"password" : hashed.encode('utf-8')
			}
			write_result = mongo.app.users.insert(user)
			if isinstance(write_result, ObjectId):
				# Return the encoded oid to reference for the tasks
				token = generate_token(email)
				return make_response(json.jsonify({
					"token" : token,
					"email" : email
					}), 200)
			else:
				return json.jsonify({
					"error" : "Could not write user to DB"
					})
		else:
			response = make_response(json.jsonify({
				"error" : True
				}))
			response.status_code = 415 # unsupported media type
			response.headers['Content-Type'] = 'application/json'
			return response

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