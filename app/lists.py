from app import app, mongo
from flask import request, json, Response
from bson.objectid import ObjectId

import base64

# Lists API
@app.route('/api/lists', methods=['GET', 'POST', 'PUT', 'DELETE'])
def lists():

	# GET
	if request.method == 'GET':

		# There are some arguments
		if request.args:

			query = {}

			# All query
			if request.args['all']:
				print("Getting all lists")
				pass

			# Normal search query
			else:
				for arg in request.args:
					query[arg] = request.args[arg]

			# Perform the search
			cursor = mongo.db.lists.find(query)

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
				body.append(temp)
			return json.jsonify({
				"results" : body
				})



		# Query is empty, you GET nothing!
		else:
			#HANDLE BETTER
			return json.jsonify({
				"results" : 0
				})

	# POST
	elif request.method == 'POST':
		if request.headers['Content-Type'] == 'application/json':
			body = request.json

			write_result = mongo.db.lists.insert(body)

		# Great jerb!		
		if isinstance(write_result, ObjectId):
			# Return the encoded oid to reference for the tasks
			return json.jsonify({
				"success" : True,
				"oid" : base64.b64encode(str(write_result))
				})

		# Something bad happened
		else:
			return json.jsonify({
				"errmsg" : "Failed to write list"
				})

	# PUT
	elif request.method == 'PUT':
		return "PUT REQUEST"

	# DELETE
	elif request.method == 'DELETE':
		return "DELETE REQUEST"
