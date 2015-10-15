from functools import wraps
from flask import request, make_response, json
from tasky import app

import base64
import bcrypt
import jwt

def validate_token(auth_header):
	token = auth_header.split(" ")[1]
	if (token == 'false'):
		token = False
	return token

# Returns 401 for unauthenticated tokens
def no_auth():
	response = make_response(json.jsonify({
	"error" : "Authentication token is invalid or has been revoked."
	}))
	response.status_code = 401 # unsupported media type
	response.headers['Content-Type'] = 'application/json'
	return response

# Wrapper to authenticate API methods
def requires_auth(f):
	@wraps(f)
	def decorator(*args, **kwargs):
		auth = request.headers['Authorization']
		if not auth or not validate_token(auth):
			return no_auth()
		return f(*args, **kwargs)
	return decorator

# Revalidates token
@app.route('/api/auth', methods=['POST'])
def check_auth():
	auth = request.headers['Authorization']
	if not auth or not validate_token(auth):
		return make_response("", 401)
	else:
		return make_response("", 200)

# makes a JWT from a dictionary
def generate_token(params):
	payload = {}
	for key in params:
		payload[key] = params[key]
	payload['iss'] = "tasky:5000"
	return jwt.encode(payload, app.secret, algorithm='HS256')