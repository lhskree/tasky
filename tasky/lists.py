from tasky import app, mongo
from flask import request, json
from bson.objectid import ObjectId

from auth import *

import base64

# Lists API
@app.route('/api/lists', methods=['GET', 'POST', 'DELETE'])
@requires_auth
def lists():

	# GET query on all lists
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
			cursor = mongo.app.lists.find(query)

			# Parse and return the body
			body = []
			for item in cursor:
				temp = {}
				for key in item:
					if key == '_id':
						id = str(item['_id']).encode('ascii')
						temp['oid'] = base64.b64encode(id).decode('ascii')
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

	# POST to save a new list
	elif request.method == 'POST':
		if request.headers['Content-Type'] == 'application/json':
			body = request.json

			write_result = mongo.app.lists.insert(body)

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

	# DELETE will delete all lists!
	elif request.method == 'DELETE':
		drop_result = mongo.app.lists.drop()

		return json.jsonify({
			"drop_result" : drop_result
			})

# List requests on a single list
@app.route('/api/lists/<string:oid>', methods=['GET', 'PUT', 'DELETE'])
def single_list(oid):

	# GET a list by oid
	if request.method == 'GET':
		return "GET"

	# PUT to update a single list
	elif request.method == 'PUT':
		if request.headers['Content-Type'] == 'application/json':
			body = request.json

			# query by decoded oid
			query = {}
			query['_id'] = ObjectId(base64.b64decode(oid).decode('ascii'))

			#update each of the keys
			# TODO update via patch for diff of keys
			update = {}
			update["$set"] = {}
			for key in body:
				update["$set"][key] = body[key]
			write_result = mongo.app.lists.update(query, update)
			return json.jsonify(write_result)
		# handle put with bad content-type
		return False

	# DELETE a single list
	elif request.method == 'DELETE':
		# this should also delete all tasks associated with the list
		
		# query by decoded oid
		query = {}
		query['_id'] = ObjectId(base64.b64decode(oid))

		delete_result = mongo.app.lists.remove(query)
		return json.jsonify(delete_result)












