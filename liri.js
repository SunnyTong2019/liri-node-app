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
var textDivider = "-----------------------------------------------------------\n";
var commandDivider = "-----------------------------------------------------------\n\n\n";

// determine which command user has typed and then call the corresponding function
switch (command) {
    case "concert-this":
        logStream.write("Command: " + process.argv[2] + " " + process.argv.slice(3).join(" ") + "\nOutput: \n");
        concertThis(process.argv.slice(3).join("+"));
        break;

    case "spotify-this-song":
        logStream.write("Command: " + process.argv[2] + " " + process.argv.slice(3).join(" ") + "\nOutput: \n");
        spotifyThis(process.argv.slice(3).join(" "));
        break;

    case "movie-this":
        logStream.write("Command: " + process.argv[2] + " " + process.argv.slice(3).join(" ") + "\nOutput: \n");
        movieThis(process.argv.slice(3).join("+"));
        break;

    case "do-what-it-says":
        logStream.write("Command: " + process.argv[2] + '\n');
        random();
        break;
}


function concertThis(artist) {

    if (!artist) { // if no artist is provided, log an error
        console.log(textDivider + "Error: Missing required request parameters: [artistname]\n" + textDivider);
        logStream.write(textDivider + "Error: Missing required request parameters: [artistname]\n" + commandDivider);
    } else {
        // using .trim() in case user types white spaces at the beginning and the end, Ex. node liri.js concert-this "  lady gaga   "
        var queryURL = "https://rest.bandsintown.com/artists/" + artist.trim() + "/events?app_id=codingbootcamp";

        axios.get(queryURL).then(

            function (response) {

                var dataArray = response.data;

                if (dataArray.length > 0) { // if venue(s) found for the artist
                    for (var i in dataArray) {
                        console.log(textDivider +
                            "Venue Name: " + dataArray[i].venue.name + "\n" +
                            "Venue Location: " + dataArray[i].venue.city + ", " + dataArray[i].venue.country + "\n" +
                            // use moment to format the date
                            "Venue Date: " + moment(dataArray[i].datetime, "YYYY-MM-DD").format("MM/DD/YYYY"));

                        logStream.write(textDivider +
                            "Venue Name: " + dataArray[i].venue.name + "\n" +
                            "Venue Location: " + dataArray[i].venue.city + ", " + dataArray[i].venue.country + "\n" +
                            "Venue Date: " + moment(dataArray[i].datetime, "YYYY-MM-DD").format("MM/DD/YYYY") + "\n");

                    }

                    console.log(textDivider);
                    logStream.write(commandDivider);

                } else { // if no venue for the artist
                    console.log(textDivider + "No Venue found for this artist!\n" + textDivider);
                    logStream.write(textDivider + "No Venue found for this artist!\n" + commandDivider);
                }
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
}


function spotifyThis(song) {

    if (!song) { song = "The Sign"; }

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

                console.log(textDivider +
                    // then use .join to make variable "artists" array to a string seperated with ", "
                    "Artist(s): " + artists.join(", ") + "\n" +
                    "Song: " + dataArray[i].name);

                if (dataArray[i].preview_url) { console.log("Preview Link: " + dataArray[i].preview_url); }
                else { console.log("Preview Link: None"); }

                console.log("Album: " + dataArray[i].album.name);

                logStream.write(textDivider +
                    // then use .join to make variable "artists" array to a string seperated with ", "
                    "Artist(s): " + artists.join(", ") + "\n" +
                    "Song: " + dataArray[i].name + "\n");

                if (dataArray[i].preview_url) { logStream.write("Preview Link: " + dataArray[i].preview_url + '\n'); }
                else { logStream.write("Preview Link: None" + '\n'); }

                logStream.write("Album: " + dataArray[i].album.name + '\n');
            }
            console.log(textDivider);
            logStream.write(commandDivider);
        });
}


function movieThis(movie) {

    if (!movie) { movie = "Mr. Nobody"; }

    var queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    axios.get(queryURL).then(

        function (response) {

            console.log(
                textDivider +
                "Movie Title: " + response.data.Title + "\n" +
                "Year: " + response.data.Year + "\n" +
                "IMDB Rating: " + response.data.imdbRating + "\n" +
                // response.data.Ratings is an array of objects
                // use .filter() to get an array filled with only the object for Rotten Tomatoes Rating
                // then use [0] to access the object in the new array then use .Value to access the property
                "Rotten Tomatoes Rating: " + response.data.Ratings.filter(item => item.Source === "Rotten Tomatoes")[0].Value + "\n" +
                "Country: " + response.data.Country + "\n" +
                "Language: " + response.data.Language + "\n" +
                "Plot: " + response.data.Plot + "\n" +
                "Actors: " + response.data.Actors + "\n" +
                textDivider);

            logStream.write(
                textDivider +
                "Movie Title: " + response.data.Title + "\n" +
                "Year: " + response.data.Year + "\n" +
                "IMDB Rating: " + response.data.imdbRating + "\n" +
                "Rotten Tomatoes Rating: " + response.data.Ratings.filter(item => item.Source === "Rotten Tomatoes")[0].Value + "\n" +
                "Country: " + response.data.Country + "\n" +
                "Language: " + response.data.Language + "\n" +
                "Plot: " + response.data.Plot + "\n" +
                "Actors: " + response.data.Actors + "\n" +
                commandDivider);

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

        logStream.write("random.txt: " + data + "\nOutput: \n");

        var dataArr = data.split(",");

        var command = dataArr[0];

        // determine which command in the random.txt file and then call the corresponding function
        switch (command) {
            case "concert-this":
                // use .replace() to remove the quotes in the "artist" string when random.txt is concert-this,"taylor swift"
                // otherwise the queryURL will look like this and the API will respone with an error saying 'The artist was not found':
                // https://rest.bandsintown.com/artists/"taylor swift"/events?app_id=codingbootcamp
                dataArr[1] ? concertThis(dataArr[1].replace(/['"]+/g, '')) : concertThis(dataArr[1]);
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



