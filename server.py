from tasky import app
from config import * 

# Server options
app.config.from_object('config.development')
app.run()