const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

//declaring global variables:
let location = '';
let temp = '';
let description = '';
let iconImage = '';
let checked = '';

app.get("/", (req, res) => {
    res.render("weather", {
        location: location,
        temp: temp,
        description: description,
        iconImage: iconImage,
        checked: checked
    });
});

app.post("/", (req, res) => {
    console.log("server consoling starts here")
    const coord = req.body.coord;
    const cityName = req.body.cityName;

    const apiKey = "d019886d661bd65b00e4501340c76346";
    const unit = "metric";
    let url = `https://api.openweathermap.org/data/2.5/weather?q="Toronto"&appid=${apiKey}&units=${unit}`;

    if (coord) {
        checked = "checked";
        console.log(req.body.coord);
        const coordArr = coord.split(",");
        const lat = coordArr[0];
        const lon = coordArr[1];
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
    };
    if (cityName) {
        checked = "";
        console.log(req.body.cityName);
        const query = req.body.cityName;
        url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${unit}`;
    };

    https.get(url, (response) => {
        response.on('error', (err) => {
            console.log(err);
            res.redirect("/");
        })
        response.on("data", (data) => {
            // console.log(data);
            const weatherData = JSON.parse(data);
            console.log("weatherData:", weatherData);
            if (weatherData.cod == 200) {
                location = weatherData.name;
                temp = weatherData.main.temp;
                description = weatherData.weather[0].description;
                const iconCode = weatherData.weather[0].icon;
                iconImage = `https://openweathermap.org/img/wn/${iconCode}@2x.png`
            };
        });
        response.on('end', () => {
            res.redirect("/");
        })
    });
});

app.listen(3000, () => {
    console.log("Weather app is running on port 3000");
});