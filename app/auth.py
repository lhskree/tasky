from functools import wraps
from flask import request, make_response, json

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
	def decorator(*args, **kwargs):
		auth = request.headers['Authorization']
		if not auth or not validate_token(auth):
			return no_auth()
		return f(*args, **kwargs)
	return decorator

def dec(f):
	@wraps(f)
	def decorator(*args, **kwargs):
		print("Hello")
		return f(*args, **kwargs)
	return decorator