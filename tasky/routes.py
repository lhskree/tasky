from tasky import app, mongo
from flask import request

# Different endpoints
from . import tasks
from . import lists
from . import login
from . import logout
from . import user

# Authorization decorators and functions
from auth import *

# Application route (root) RUTE?
@app.route('/')
@app.route('/index')
@app.route('/index.html')
def index():
	return app.send_static_file('index.html')