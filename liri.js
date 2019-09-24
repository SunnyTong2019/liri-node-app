require("dotenv").config();

var moment = require('moment');
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var fs = require('fs');
var axios = require('axios');

var spotify = new Spotify(keys.spotify);

// writeStream for outputting data to log.txt file
var logStream = fs.createWriteStream('log.txt', { 'flags': 'a' }); // use {'flags': 'a'} to append and {'flags': 'w'} to erase and write a new file

var command = process.argv[2];

// determine which command user has typed and then call the corresponding function
switch (command) {
    case "concert-this":
        var artist = process.argv.slice(3).join("+");
        logStream.write("Command: " + process.argv[2] + " " + process.argv.slice(3).join(" ") + '\n');
        logStream.write("Output: " + '\n');
        if (!artist) { // if no artist is provided, log an error
            console.log("Error: Missing required request parameters: [artistname]");
            logStream.write("-----------------------------------------------" + '\n');
            logStream.write("Error: Missing required request parameters: [artistname]" + '\n');
            logStream.write("-----------------------------------------------" + '\n\n\n');
        } else {
            concertThis(artist);
        }
        break;

    case "spotify-this-song":
        var song = process.argv.slice(3).join(" ");
        if (!song) { song = "The Sign"; }
        logStream.write("Command: " + process.argv[2] + " " + process.argv.slice(3).join(" ") + '\n');
        logStream.write("Output: " + '\n');
        spotifyThis(song);
        break;

    case "movie-this":
        var movie = process.argv.slice(3).join("+");
        if (!movie) { movie = "Mr. Nobody"; }
        logStream.write("Command: " + process.argv[2] + " " + process.argv.slice(3).join(" ") + '\n');
        logStream.write("Output: " + '\n');
        movieThis(movie);
        break;

    case "do-what-it-says":
        logStream.write("Command: " + process.argv[2] + '\n');
        random();
        break;
}


function concertThis(artist) {

    // using .trim() in case user types white spaces at the beginning and the end, Ex. node liri.js concert-this "  lady gaga   "
    var queryURL = "https://rest.bandsintown.com/artists/" + artist.trim() + "/events?app_id=codingbootcamp";

    axios.get(queryURL).then(

        function (response) {

            var dataArray = response.data;

            for (var i in dataArray) {
                console.log("-----------------------------------------------");
                console.log("Venue Name: " + dataArray[i].venue.name);
                console.log("Venue Location: " + dataArray[i].venue.city + ", " + dataArray[i].venue.country);
                // use moment to format the date
                console.log("Venue Date: " + moment(dataArray[i].datetime, "YYYY-MM-DD").format("MM/DD/YYYY"));

                logStream.write("-----------------------------------------------" + '\n');
                logStream.write("Venue Name: " + dataArray[i].venue.name + '\n');
                logStream.write("Venue Location: " + dataArray[i].venue.city + ", " + dataArray[i].venue.country + '\n');
                logStream.write("Venue Date: " + moment(dataArray[i].datetime, "YYYY-MM-DD").format("MM/DD/YYYY") + '\n');

            }

            console.log("-----------------------------------------------");
            logStream.write("-----------------------------------------------" + '\n\n\n');

        }).catch(function (error) {

            if (error.response) {
                // The request was made and the server responded with a status code that falls out of the range of 2xx
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

                // "artists" property in each dataArray item is an array of objects
                // each object has several properties but I only need the "name" property, so I push the "name" to new variable "artists"
                // so variable "artists" is an array with all the artist names
                for (var j in dataArray[i].artists) {
                    artists.push(dataArray[i].artists[j].name);
                }

                console.log("-----------------------------------------------");
                // then use .join to make variable "artists" array to a string seperated with ", "
                console.log("Artist(s): " + artists.join(", "));
                console.log("Song: " + dataArray[i].name);
                console.log("Preview Link: " + dataArray[i].preview_url);
                console.log("Album: " + dataArray[i].album.name);

                logStream.write("-----------------------------------------------" + '\n');
                logStream.write("Artist(s): " + artists.join(", ") + '\n');
                logStream.write("Song: " + dataArray[i].name + '\n');
                logStream.write("Preview Link: " + dataArray[i].preview_url + '\n');
                logStream.write("Album: " + dataArray[i].album.name + '\n');

            }
            console.log("-----------------------------------------------");
            logStream.write("-----------------------------------------------" + '\n\n\n');
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
            // response.data.Ratings is an array of objects
            // use .filter() to get an array filled with only the object for Rotten Tomatoes Rating
            // then use [0] to access the object in the new array then use .Value to access the property
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings.filter(item => item.Source === "Rotten Tomatoes")[0].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log("-----------------------------------------------");

            logStream.write("-----------------------------------------------" + '\n');
            logStream.write("Movie Title: " + response.data.Title + '\n');
            logStream.write("Year: " + response.data.Year + '\n');
            logStream.write("IMDB Rating: " + response.data.imdbRating + '\n');
            logStream.write("Rotten Tomatoes Rating: " + response.data.Ratings.filter(item => item.Source === "Rotten Tomatoes")[0].Value + '\n');
            logStream.write("Country: " + response.data.Country + '\n');
            logStream.write("Language: " + response.data.Language + '\n');
            logStream.write("Plot: " + response.data.Plot + '\n');
            logStream.write("Actors: " + response.data.Actors + '\n');
            logStream.write("-----------------------------------------------" + '\n\n\n');

        }).catch(function (error) {

            if (error.response) {
                // The request was made and the server responded with a status code that falls out of the range of 2xx
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

        logStream.write("random.txt: " + data + '\n');
        logStream.write("Output: " + '\n');

        var dataArr = data.split(",");

        var command = dataArr[0];

        // determine which command in the random.txt file and then call the corresponding function
        switch (command) {
            case "concert-this":
                // use .replace() to remove the quotes in the "artist" string when random.txt is concert-this,"taylor swift"
                // otherwise the queryURL will look like this and the API will respone with an error saying 'The artist was not found':
                // https://rest.bandsintown.com/artists/"taylor swift"/events?app_id=codingbootcamp
                if (dataArr[1]) { concertThis(dataArr[1].replace(/['"]+/g, '')); }
                else {
                    console.log("Error: Missing required request parameters: [artistname]");
                    logStream.write("-----------------------------------------------" + '\n');
                    logStream.write("Error: Missing required request parameters: [artistname]" + '\n');
                    logStream.write("-----------------------------------------------" + '\n\n\n');
                }
                break;

            case "spotify-this-song":
                if (dataArr[1]) { spotifyThis(dataArr[1]); }
                else { spotifyThis("The Sign"); }
                break;

            case "movie-this":
                if (dataArr[1]) { movieThis(dataArr[1]); }
                else { movieThis("Mr. Nobody"); }
                break;
        }

    })

}



