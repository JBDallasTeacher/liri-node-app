
// file to hide keys
require('dotenv').config();

var request = require("request");
var spotify = require("node-spotify-api");

var keys = require("./keys.js");
var songs = new spotify(keys);
var fs = require("fs");
var axios = require('axios');

var movieName = process.argv[3];
var liriOptions = process.argv[2];


function spotifySong(trackName) {
    var trackName = process.argv[3];
    if (!trackName) {
        trackName = "the sign";
        //singer = "ace of base";
    };
    //songRequest = trackName;
    songs.search({
        type: "track",
        query: trackName
    },

        function (err, data) {
            if (!err) {
                var trackInfo = data.tracks.items;

                for (var i = 0; i < 2; i++) {
                    if (trackName == "the sign") {
                        console.log("Artist: Ace of Base " + " Song: the sign");
                        break;
                    } else {
                        if (trackInfo[i] != undefined && trackName != "the sign") {
                            var spotifyResults =
                                "Artist: " + trackInfo[i].artists[0].name + "\n" +
                                "Song: " + trackInfo[i].name + "\n" +
                                "Preview URL: " + trackInfo[i].preview_url + "\n" +
                                "Album: " + trackInfo[i].album.name + "\n" +

                                console.log(spotifyResults);
                            console.log('  ');

                            var songInfo = data.tracks.items[i];

                            var artist = songInfo.artists[0].name;
                            //console.log(artist);
                            var album = songInfo.album.name;
                            var songName = songInfo.name;
                            var songURL = songInfo.preview_url;
                            //create a variable that holds all of the data so it can go into a file       
                            var dataObject = { Artist: artist, Song: songName, Preview: songURL, Album: album };
                            //put data into a file        
                            fs.appendFileSync("log.txt", JSON.stringify(dataObject, null, 2));;
                        };
                    };
                };
            } else {
                console.log("error:  " + err);
                return;
            };
        });
};

function movieThis() {

    // Grab or assemble the movie name and store it in a variable called "movieName"

    var movieName;

    if (process.argv[3] === " " || process.argv[3] === undefined) {

        movieName = "Mr.Nobody";

    } else {

        movieName = process.argv[3];

    };

    // console.log(movieName);
    // Then run a request to the OMDB API with the movie name specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=8ed601e1";

    request(queryUrl, function (error, response, body) {
        // console.log(response)

        if (error) {
            console.log('Error occurred: ' + error);
            return;
        }

        var movieInfo = JSON.parse(body)

        var title = movieInfo.Title;
        var year = movieInfo.Year;
        var rating = movieInfo.Ratings;
        var imdbRating = rating[0].Source.Value;
        var rottenTomsRating = rating[1].Source.Value;
        var countryProduction = movieInfo.Country;
        var language = movieInfo.Language;
        var plot = movieInfo.Plot;
        var actors = movieInfo.Actors;
        console.log("================================");
        console.log(title);
        console.log(year);
        console.log(imdbRating);
        console.log(rottenTomsRating);
        console.log(countryProduction);
        console.log(language);
        console.log(plot);
        console.log(actors);
        console.log("================================")
        //create a variable that holds all of the data so it can go into a file       
        var dataMovie = { "Title": title, "Year": year, "IMDB Rating": imdbRating, "Rotten Tommatos Rating": rottenTomsRating, 'Country of Production': countryProduction, "Language": language, "Plot": plot, "Actors": actors };
        //put data into a file    
        // console.log(dataMovie)    
        fs.appendFileSync("log.txt", JSON.stringify(dataMovie, null, 2));;
    })
};

function randomPick() {
    fs.readFile("random.txt", "UTF-8", function (error, data) {
        if (error) {
            console.log(error);
        } else {
            console.log(data);

        }
    })

};

function concertThis() {

    if (process.argv[3] === "" || process.argv[3] === undefined) {

        media = "Veracruz";

    } else {

        media = process.argv[3];

    };

    request("https://rest.bandsintown.com/artists/" + media + "/events?app_id=codingbootcamp", function (error, response, data) {
        try {
            var response = JSON.parse(data)
            if (response.length != 0) {
                console.log(chalk.green(`Upcoming concerts for ${media} include: `))
                response.forEach(function (element) {
                    console.log(chalk.cyan("Venue name: " + element.venue.name));
                    if (element.venue.country == "United States") {
                        console.log("City: " + element.venue.city + ", " + element.venue.region);
                    } else {
                        console.log("City: " + element.venue.city + ", " + element.venue.country);
                    }
                    console.log("Date: " + moment(element.datetime).format('MM/DD/YYYY'));
                    console.log();
                })
            } else {
                console.log(chalk.red("No concerts found."));
            }
        }
        catch (error) {
            console.log(chalk.red("No concerts found."));
        }
    });
};

// Execute liri options
switch (liriOptions) {

    case "spotify-this-song":
        console.log('spotify')
        spotifySong();
        break;

    case "movie-this":
        movieThis();
        break;

    case "concert-this":
        concertThis();
        break;

    case "do-what-it-says":
        randomPick();
        break;

    default:
        console.log("It won't work if you don't enter a command.");
        break;
};