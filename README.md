# Title
LIRI


## About
LIRI is a command line node app that takes in parameters and gives you back data.
LIRI will search Spotify for songs, Bands in Town for concerts, and OMDB for movies.
LIRI can take in one of the following commands:
 * concert-this
 * spotify-this-song
 * movie-this
 * do-what-it-says


## Technologies Used 
The app is created with node.js using below packages:
 * moment
 * node-spotify-api
 * axios
 * dotenv


## Instructions 
node liri.js concert-this <artist/band name here>
This will search the Bands in Town Artist Events API for an artist/band and output the following information about each event to the terminal and log.txt file:

 * Venue Name
 * Venue location
 * Venue Date (in format "MM/DD/YYYY")

node liri.js spotify-this-song <song name here>
This will search the Spotify API for a song and output the following information about the song to the terminal and log.txt file:

 * Artist(s)
 * Song
 * Preview Link
 * Album

If no song is provided then by default it will search the song "The Sign" (by Ace of Base).

node liri.js movie-this '<movie name here>'
This will search the OMDB API for a movie and output the following information to the terminal and log.txt file:

 * Movie Title
 * Movie Year    
 * IMDB Rating
 * Rotten Tomatoes Rating 
 * Country 
 * Language 
 * Plot 
 * Actors 

If no movie is provided then by default it will search the movie 'Mr. Nobody’.

node liri.js do-what-it-says
This will take the text inside of random.txt file and then use it to call one of LIRI's commands.

Ex. If the text inside of random.txt is 

```
spotify-this-song,”I Want it That Way" 
```

Then it will run spotify-this-song command for the song “I Want it That Way".


## Screenshots, Gifs and Videos


## Deployed Link
N/A


## Contributor
The app is developed by [SunnyTong2019](https://github.com/SunnyTong2019).


## License
[MIT](https://choosealicense.com/licenses/mit/)