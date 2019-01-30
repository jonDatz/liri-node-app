require("dotenv").config();
const keys = require("./keys.js");
// add npm packages
const axios = require("axios");
const Spotify = require("node-spotify-api");
const moment = require("moment");
const fs = require('fs');

const spotify = new Spotify(keys.spotify);


let type = process.argv[2];


// Build each Api's calls first

// BandsinTown API


let bitEvents = function () {
    let artist = process.argv.slice(3).join(" ");


    let bitURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    console.log("Checking BandsinTown..");

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
// * Artist(s)

// * The song's name

// * A preview link of the song from Spotify

// * The album that the song is from

let spotifySong = function () {
    let song = process.argv.slice(3).join(" ");
    spotify
        .search({
            type: 'track',
            query: song
        })
        .then(function (response) {
            console.log("\nChecking Spotify...\n");
            console.log("[=============================================================]");

            // SONG NAME
            let songName = response.tracks.items[1].name;
            // ALBUM NAME
            let albumName = response.tracks.items[1].album.name;
            // PREVIEW URL
            let previewName = response.tracks.items[1].preview_url;
            // spotArtist gets the artist. DONT TOUCH
            let spotArtist = response.tracks.items[0].artists[0].name;


            console.log("\nArtist: " + spotArtist + "\nSong Name: " + songName + "\nAlbum: " + albumName + "\nUrl: " + previewName);

            console.log("\n[=============================================================]");



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

// DO WHAT IT SAYS
let doWhatItSays = function () {
    fs.readFile('random.txt', 'utf8', function (error, data) {
            if (error) {
                console.log('ERROR: Reading random.txt -- ' + error);
                return;
            } else {
                // Creates array with data and splits
                var fileArray = data.split(",");
                // Sets action to first item in array.
                type = fileArray[0];
                console.log(type);
                // Sets third argument to second item in array.
                let dataRand = fileArray[1];
                console.log(dataRand);
            }
        })
    };


    // Switch case for listing multiple commands: `concert-this`,   `spotify-this-song`,    `movie-this`,    `do-what-it-says`

    switch (type) {
        case "concert-this":
            bitEvents();
            break;

        case "spotify-this-song":
            spotifySong();
            break;

        case "movie-this":
            movieDetails();
            break;

        case "do-what-it-says":
            console.log("switch case do-all worked!");
            doWhatItSays();



            break;

        default:


            break;
    }