require("dotenv").config();

// Module requirements

var keys = require('./keys.js');
var request = require('request');
var dotenv = require('dotenv');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var fs = require("fs");

// User inputs

var command = process.argv[2];
var slice = process.argv.slice(3);
var arg = slice.join(' ');

// Command options

switch (command) {
    case "my-tweets":
        myTweets();
        break;

    case "spotify-this-song":
        spotifySong(arg);
        break;
    case "movie-this":
        movieThis(arg);
        break;
    case "do-what-it-says":
        doIt();
        break;
    default:
        console.log("Invalid command. Please enter 'my-tweets', 'spotify-this-song', 'movie-this', or 'do-what-it-says'.")
}

// Twitter function

function myTweets() {
    var params = { screen_name: "HClinteresting", count: 20 };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            console.log("TWEETS:");
            console.log("-------");
            for (i = 0; i < tweets.length; i++) {
                console.log("Created at: " + tweets[i].created_at);
                console.log("Tweet: " + tweets[i].text);
                console.log("------------------------");
            }
        }
        else {
            console.log("Twitter error");
        }
    });
}

// Spotify function

function spotifySong(arg) {
    if (arg === "") {
        arg = "The Sign Ace of Base"
    }
    spotify.search({ type: 'track', query: arg }, function (err, data) {
        if (err) {
            console.log("Spotify error");
            return;
        }
        var song = data.tracks.items[0];
        console.log("---Artist---");
        for (i = 0; i < song.artists.length; i++) {
            console.log(song.artists[i].name);
        }
        console.log("----Song---");
        console.log(song.name);
        console.log("---Preview Link---");
        console.log(song.preview_url);
        console.log("---Album---");
        console.log(song.album.name);
    });
}

// Movie function

function movieThis(arg) {
    if (arg === "") {
        console.log("If you haven't watched 'Mr. Nobody,' then you should. It's on Netflix!");
        arg = "Mr. Nobody."
    }
    var movieURL = 'http://www.omdbapi.com?apikey=trilogy&t=' + arg + '&plot=short&tomatoes=true';
    request(movieURL, function (error, response, body) {
        var body = JSON.parse(body);
        console.log("Title: " + body.Title);
        console.log("Year: " + body.Year);
        console.log("IMdB Rating: " + body.imdbRating);
        console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
        console.log("Country: " + body.Country);
        console.log("Language: " + body.Language);
        console.log("Plot: " + body.Plot);
        console.log("Actors: " + body.Actors);
    });
}

// Random function

function doIt() {
    fs.readFile('random.txt', "utf8", function (error, data) {
        var random = data.split(',');

        switch (random[0]) {
            case "my-tweets":
                myTweets(random[1]);
                break;
            case "spotify-this-song":
                spotifySong(random[1]);
                break;
            case "movie-this":
                movieThis(random[1]);
                break;
            default:
                console.log("Nothing there.")
        }
    });
}