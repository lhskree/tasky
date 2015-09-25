from app import app, mongo
from flask import request, json, Response

# Tasks API
@app.route('/api/tasks', methods=['GET', 'POST', 'PUT', 'DELETE'])
def tasks():

	# GET
	if request.method == 'GET':

		# There are some arguments
		if request.args:
			query = {}
			for arg in request.args:
				query[arg] = request.args[arg]
			cursor = mongo.db.tasks.find(query)
			for c in cursor:
				print(c)
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
			mongo.db.tasks.insert(body)
		return "POST REQUEST"

	# PUT
	elif request.method == 'PUT':
		return "PUT REQUEST"

	# DELETE
	elif request.method == 'DELETE':
		return "DELETE REQUEST"
		