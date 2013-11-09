### Rest api Reference

* api responses follow standard HTTP codes (200 for success, 404 for not found, 400 for bad request etc)


#### user info [GET]
	/user

	200: authenticated. returned JSON = {name:<name>}
	404: user not found.

#### register user [POST]
	/user 
	POST BODY: name=<name>

	200: success
	400: bad request

#### list of games ready to play [GET]
	/games/ready

	200: array of gameObjects. 
	     gameObject = {
	     	id: <gameId>,
	     	created_by: <createdUserId>,
	     	joined_by: <joinedUserId>
	     }

#### list of games currently being played [GET]
	/games/started

	200: array of gameObjects. 

#### start a game [POST]
	/game/start

#### join a game [POST]
	/game/join/<gameId>