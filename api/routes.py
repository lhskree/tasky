from app import app, mongo

# Different endpoints
import tasks
import lists

# Default routes
@app.route('/')
def index():
	return app.send_static_file('index.html')