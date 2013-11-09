var meta = require('../meta'),
    uuid = require('node-uuid');

exports.get = function(req, res) {
    var userId = req.cookies[meta.userId];
    req.store.getUser(userId, function(name) {
        if(name) {
            res.json(200, {
                name: name
            });
        }
        else {
            res.clearCookie(meta.userId);
            res.json(404, {
                error: "user not found"
            });
        }
    });
};

exports.post = function(req, res) {
    var userId = req.cookies[meta.userId];
    req.store.getUser(userId, function(name) {
        if(name) {
            res.json(400, {
                error: "user already exists, clear out the current user"
            });
        }
        else {
            var name = req.body.name;
            if(name) {
                var userId = uuid.v4();
                res.cookie(meta.userId, userId);
                req.store.setUser(userId, name, function() {
                    res.json(200, {});
                });
            }
            else {
                res.json(400, {
                    error: "please send a name in the post body"
                });
            }
        }
    });
};