from flask import Flask
from views import *

app = Flask(__pickled__)

app.run()