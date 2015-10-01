from app import app, mongo
from flask import request, json
from bson.objectid import ObjectId

import base64

# Tasks API
@app.route('/api/tasks', methods=['GET', 'POST', 'PUT', 'DELETE'])
def tasks():

	# GET
	if request.method == 'GET':

		# There are some arguments
		if request.args:

			query = {}

			# All query
			if request.args['all']:
				print("Getting all lists")

			# Normal search query
			else:
				for arg in request.args:
					query[arg] = request.args[arg]

			# Perform the search
			cursor = mongo.app.tasks.find(query)

			# Parse and return the body
			body = []
			for item in cursor:
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
			write_result = mongo.app.tasks.insert(body)

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

	# DELETE will delete all tasks!
	elif request.method == 'DELETE':
		drop_result = mongo.app.tasks.drop()

		return json.jsonify({
			"drop_result" : drop_result
			})

# List requests on a single list
@app.route('/api/tasks/<string:oid>', methods=['GET', 'PUT', 'DELETE'])
def single_task(oid):

	# GET a list by oid
	if request.method == 'GET':
		return "GET"

	# PUT to update a single list
	elif request.method == 'PUT':
		if request.headers['Content-Type'] == 'application/json':
			body = request.json

			# query by decoded oid
			query = {}
			query['_id'] = ObjectId(base64.b64decode(oid))

			#update each of the keys
			# TODO update via patch for diff of keys
			update = {}
			update["$set"] = {}
			for key in body:
				update["$set"][key] = body[key]
			write_result = mongo.app.tasks.update(query, update)
			return json.jsonify(write_result)
		# handle put with bad content-type
		return False

	# DELETE a single list
	elif request.method == 'DELETE':
		# this should also delete all tasks associated with the list
		
		# query by decoded oid
		query = {}
		query['_id'] = ObjectId(base64.b64decode(oid))

		delete_result = mongo.app.tasks.remove(query)
		return json.jsonify(delete_result)

		