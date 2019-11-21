
// This application will have two parts: a homepage that asks the user for their ZIP Code  and a route that sends the temperature as JSON.

var path = require("path");
var express = require("express");
var zipdb = require("zippity-do-dah");
var ForecastIo = require("forecastio");
var app = express();
var weather = new ForecastIo("e55b251bd2e236587f3d4f7c5c156705");
app.use(express.static(path.resolve(__dirname, "public")));
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");
app.get("/", function (req, res) {
    res.render("index");
});
app.get(/^\/(\d{5})$/, function (req, res, next) {
    var zipcode = req.params[0];
    var location = zipdb.zipcode(zipcode);
    if (!location.zipcode) {
        next();
        return;
    }
    var latitude = location.latitude;
    var longitude = location.longitude;
    weather.forecast(latitude, longitude, function (err, data) {
        if (err) {
            next();
            return;
        }
        res.json({
            zipcode: zipcode,
            temperature: data.currently.temperature
        });
    });
});
app.use(function (req, res) {
    res.status(404).render("404");
});
app.listen(3000);