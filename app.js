const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const dotenv = require("dotenv/config");

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
let pokemonMap = new Map ([
    ["01d", "192"],
    ["01n", "338"],
    ["02d", "333"],
    ["02n", "334"],
    ["03d", "147"],
    ["03n", "148"],
    ["04d", "278"],
    ["04n", "284"],
    ["09d", "270"],
    ["09n", "350"],
    ["10d", "535"],
    ["10n", "382"],
    ["11d", "135"],
    ["11n", "145"],
    ["13d", "872"],
    ["13n", "144"],
    ["50d", "468"],
    ["50n", "868"]
]);

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
    const pokeId = '';

    const apiKey = process.env.WEATHER_API_KEY;
    console.log("apiKey:", apiKey);
    console.log("pokemonMap:", pokemonMap.get("50n"));
    const unit = "metric";
    let url = `https://api.openweathermap.org/data/2.5/weather?q="Toronto"&appid=${apiKey}&units=${unit}`;
    let pokemonUrl = `https://pokeres.bastionbot.org/images/pokemon/${pokeId}.png`;
    
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
                console.log("iconCode:", iconCode);
                // iconImage = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
                iconImage = `https://pokeres.bastionbot.org/images/pokemon/${pokemonMap.get(iconCode)}.png`;
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