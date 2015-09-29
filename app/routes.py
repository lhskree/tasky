from app import app, mongo
from flask import request

# Different endpoints
from . import tasks
from . import lists

# Default routes
@app.route('/')
def index():
	print(request.url)
	return app.send_static_file('index.html')