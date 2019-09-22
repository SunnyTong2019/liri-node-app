require("dotenv").config();

var moment = require('moment');
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var fs = require('fs');
var axios = require('axios');
const { Console } = require('console');

var spotify = new Spotify(keys.spotify);

const output = fs.createWriteStream('./log.txt');
const logger = new Console( { stdout: output } );

var command = process.argv[2];

switch (command) {
    case "concert-this":
        var artist = process.argv.slice(3).join("+");
        concertThis(artist);
        logger.log('Command: ' + process.argv.slice(2));
        break;

    case "spotify-this-song":
        var song = process.argv.slice(3).join(" ");
        if (!song) { song = "The Sign"; }
        spotifyThis(song);
        break;

    case "movie-this":
        var movie = process.argv.slice(3).join("+");
        if (!movie) { movie = "Mr. Nobody"; }
        movieThis(movie);
        break;

    case "do-what-it-says":
        random();
        break;
}


function concertThis(artist) {

    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(queryURL).then(

        function (response) {

            var dataArray = response.data;

            for (var i in dataArray) {
                console.log("-----------------------------------------------");
                console.log("Venue Name: " + dataArray[i].venue.name);
                console.log("Venue Location: " + dataArray[i].venue.city + ", " + dataArray[i].venue.country);
                console.log("Venue Date: " + moment(dataArray[i].datetime, "YYYY-MM-DD").format("MM/DD/YYYY"));

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


function spotifyThis(song) {

    spotify.search({ type: 'track', query: song },

        function (err, data) {

            if (err) {
                return console.log('Error occurred: ' + err);
            }

            var dataArray = data.tracks.items;

            for (var i in dataArray) {

                var artists = [];

                for (var j in dataArray[i].artists) {
                    artists.push(dataArray[i].artists[j].name);
                }

                console.log("-----------------------------------------------");
                console.log("Artist(s): " + artists.join(", "));
                console.log("Song: " + dataArray[i].name);
                console.log("Preview Link: " + dataArray[i].preview_url);
                console.log("Album: " + dataArray[i].album.name);

            }
            console.log("-----------------------------------------------");
        });
}


function movieThis(movie) {
    var queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    axios.get(queryURL).then(

        function (response) {

            console.log("-----------------------------------------------");
            console.log("Movie Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings.filter(item => item.Source === "Rotten Tomatoes")[0].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log("-----------------------------------------------");

        })
        .catch(function (error) {

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


function random() {

    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }

        var dataArr = data.split(",");

        var command = dataArr[0];

        switch (command) {
            case "concert-this":
                concertThis(dataArr[1]);
                break;

            case "spotify-this-song":
                spotifyThis(dataArr[1]);
                break;

            case "movie-this":
                movieThis(dataArr[1]);
                break;
        }

    })

}




