require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require('axios');

var spotify = new Spotify(keys.spotify);


var command = process.argv[2];

switch (command) {
    case "concert-this":
        concert();
        break;

    case "spotify-this-song":
        spotify();
        break;

    case "movie-this":
        movie();
        break;

    case "do-what-it-says":
        random();
        break;
}

function concert() {
    var artist = process.argv.slice(3).join("+");
    var queryURl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(queryURl).then(function (response) {

        var dataArray = response.data;

        for (var i in dataArray) {
            console.log("-----------------------------------------------");
            console.log("Venue Name: " + dataArray[i].venue.name);
            console.log("Venue Location: " + dataArray[i].venue.city + ", " + dataArray[i].venue.country);
            console.log("Venue Date: " + dataArray[i].datetime);

        }

        console.log("-----------------------------------------------");

    }).catch(function (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log("---------------Data---------------");
            console.log(error.response.data);
            console.log("---------------Status---------------");
            console.log(error.response.status);
            console.log("---------------Headers---------------");
            console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an object that comes back with details pertaining to the error that occurred.
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
        }
        console.log(error.config);
    });

}