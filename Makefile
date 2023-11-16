frontend:
	cd client && PORT=80 npm start

backend:
	cd server && PORT=8080 nodemon server.js

start:
	make frontend & make backend
