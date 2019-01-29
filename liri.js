require("dotenv").config();
const keys = require("./keys.js");
const axios = require("axios");
const Spotify = require("node-spotify-api");
const moment = require("moment");
const fs = require('fs');

const spotify = new Spotify(keys.spotify);
// How could I use inquirer to make this cleaner?

let type = process.argv[2];

// Build each Api's calls first


// BandsinTown API


let bitEvents = function () {
    let artist = process.argv.slice(3).join(" ");


    let bitURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    console.log("Checking BandsinTown..");
    // We then run the request with axios module on a URL with a JSON
    axios
        .get(bitURL)
        .then(
            function (response) {
                let shows = response.data
                for (let i = 0; i < shows.length; i++) {
                    let venue = shows[i].venue.name;
                    let city = shows[i].venue.city;
                    let country = shows[i].venue.country;

                    // Moment Stuff
                    let momentTime = moment(JSON.stringify(shows[i].datetime), 'YYYY-MM-DDTHH:mm:ss');
                    let momentDate = momentTime.format('MM/DD/YYYY');

                    // Show everything
                    console.log("\n" + artist + " will be playing on " + momentDate + " in \n" + city + ", " + country + " at " + venue + "!");
                    console.log("\n#========================================#");

                }

            }
        )
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        })

};

// Spotify API

let spotifySong = function () {
    let song = process.argv.slice(3).join(" ");
    console.log(song);
    spotify
        .search({
            type: 'track',
            query: 'all the small things'
        })
        .then(function (response) {
            console.log("spotify worked");
            console.log(response);
        })
        .catch(function (err) {
            console.log("spotify didnt work");
            console.log(err);
        });
}




// OMDB API


let movieDetails = function () {
    let movie = process.argv.slice(3).join("+");

    axios
        .get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy")
        .then(
            function (response) {

                // * Title of the movie.
                // * Year the movie came out.
                // * IMDB Rating of the movie.
                // * Rotten Tomatoes Rating of the movie.
                // * Country where the movie was produced.
                // * Language of the movie.
                // * Plot of the movie.
                // * Actors in the movie.
                let movieDeetz = response.data;
                console.log("\n#=========================================================#\n");
                console.log("Title: " + movieDeetz.Title + "\n Release Date: " + movieDeetz.Released + "\nIMDB rating: " + movieDeetz.imdbRating + "\nRotten Tomatoes: " + movieDeetz.Ratings[1].Value + "\nOrigin: " + movieDeetz.Country + "\nLanguage: " + movieDeetz.Language + "\nPlot: " + movieDeetz.Plot + "\nActors: " + movieDeetz.Actors);
                console.log("\n#=========================================================#");
            }
        )
        .catch(


        )
};





// Switch case for listing multiple commands: `concert-this`,   `spotify-this-song`,    `movie-this`,    `do-what-it-says`

switch (type) {
    case "concert-this":
        console.log("switch case bandsintown worked!");
        bitEvents();
        break;

    case "spotify-this-song":
        console.log("switch case spotify worked!");
        spotifySong();
        break;

    case "movie-this":
        console.log("switch case movie worked!");
        movieDetails();
        break;

    case "do-what-it-says":
        console.log("switch case do-all worked!");

        break;

    default:
        break;
}