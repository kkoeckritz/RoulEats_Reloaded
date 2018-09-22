// Dependencies
// =============================================================

var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

// POST route for creating a new user
app.post("/api/v1/user", function(req, res) {
    console.log(req.body);
    db.User.create({
    text: req.body.text,
    complete: req.body.complete
    }).then(function(dbUser) {
    res.json(dbUser);
    });
});

    
// GET route for reading users
app.get("/api/v1/user/:id", function(req, res) {
    db.User.findAll({}).then(function(dbUser) {
    res.json(dbUser);
    });
});

// PUT route for updating users
app.put("/api/v1/user/:id", function(req, res) {

});

// DELETE route for deleting users
app.delete("/api/v1/user/:id", function(req, res) {

});


};
