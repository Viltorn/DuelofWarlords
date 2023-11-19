frontend:
	cd client && npm start

backend:
	cd server && PORT=8080 nodemon server.js

start:
	make frontend & make backend
