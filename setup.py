from distutils.core import setup
setup(
	name="tasky",
	version="0.0.1",
	author="Logan Sobczak",
	install_requires=[
	"Flask >= 0.10.0",
	"pymongo >= 3.0.3",
	"bcrypt >= 1.1.0",
	"PyJWT >= 1.4.0"]
	)