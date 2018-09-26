// Dependencies
// =============================================================
const Yelp = require("yelp-fusion");
const yelp = Yelp.client(process.env.YELP_API_KEY);
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
    db.User.update({
        text: req.body.text,
        complete: req.body.complete
      }, {
        where: {
          id: req.body.id
        }
      }).then(function(dbUser) {
        res.json(dbUser);
      });
  
});

// DELETE route for deleting users
app.delete("/api/v1/user/:id", function(req, res) {
    db.User.destroy({
        where: {
          id: req.params.id
        }
      }).then(function(dbUser) {
        res.json(dbUser);
      });
  
});

    app.get("/api/data", function(req, res) {
        yelp.search({
            term: "food",
            latitude: 38.573196100000004,
            longitude: -121.4894329,
            radius: 3200
        }).then(response => {
            res.json(response.jsonBody);
        });
    });

    // get restaurants nearby to user's lat,lon
    app.post("/api/find", function(req, res) {
        var yelp_data = {};
        var lat = req.body.lat;
        var lon = req.body.lon;
        var radius = req.body.radius;

        yelp.search({
            term: "food",
            latitude: lat,
            longitude: lon,
            radius: radius,
            limit: 35
        }).then(response => {

            // grab returned restaurant data
            yelp_data = response.jsonBody;

            const businesses = yelp_data.businesses;
            const num_ret = businesses.length;

            // choose random business from yelp data
            const rand_rest = businesses[Math.floor(Math.random() * num_ret)];

            var categories = [];

            // extract categores from yelp data
            for (c of rand_rest.categories) {
                categories.push(c.title);
            }

            res.json({
                name: rand_rest.name,
                image_url: rand_rest.image_url,
                categories: categories,
                price: rand_rest.price,
                rating: rand_rest.rating,
                address: rand_rest.location.display_address,
                distance: rand_rest.distance,
                phone: rand_rest.display_phone
            });
        }).catch(err => {
            console.log(err);
        });
    });

};
