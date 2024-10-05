front:
	cd client && npm start

back:
	cd server && PORT=8080 nodemon server.js

start:
	make front & make back
