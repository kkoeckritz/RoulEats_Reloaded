var express = require("express");
var path = require("path");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
require("dotenv").config();

var PORT = process.env.PORT || 8080;

var app = express();
app.use(express.static("public"));

// Bodyparser for automatically parsing incoming JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// link server routing data
require("./routes/api")(app);
require("./routes/html")(app, path);

app.listen(PORT, function() {
    console.log("Server listening on: http://localhost:" + PORT);
});