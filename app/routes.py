from app import app, mongo
from flask import request

# Different endpoints
from . import tasks
from . import lists
from . import login
from . import logout
from . import token
from . import user

# Default home route
@app.route('/')
def index():
	return app.send_static_file('index.html')