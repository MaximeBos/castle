//Required libraries
let Promise = require('promise');
let request = require('request');
let cheerio = require('cheerio');
let fs = require('fs');

let ListPromises = [];
let ListIndivPromises = [];
let ListRestaurants = [];
let scrapingRound = 1;


//Creation of promises
function createPromises() {
    for (i = 1; i <= 37; i++) { //list of 35 pages to check
        let url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-' + i.toString();
        ListPromises.push(fillRestaurantsList(url));
        console.log("Page " + i + " of starred Michelin restaurants added to the list");
    }
}


function createIndividualPromises() {
    return new Promise(function (resolve) {
        if (scrapingRound === 1) {
            for (let i = 0; i < ListRestaurants.length / 2; i++) {
                let restaurantURL = ListRestaurants[i].url;
                ListIndivPromises.push(fillRestaurantInfo(restaurantURL, i));
                console.log("Added url of " + i + "th restaurant to the promises list");
            }
            resolve();
            scrapingRound++;
        }
        if (scrapingRound === 2) {
            for (i = ListRestaurants.length / 2; i < ListRestaurants.length; i++) {
                let restaurantURL = ListRestaurants[i].url;
                ListIndivPromises.push(fillRestaurantInfo(restaurantURL, i));
                console.log("Added url of " + i + "th restaurant to the promises list");
            }
            resolve();
        }
    })
}

//Fetching list of all restaurants
function fillRestaurantsList(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (err, res, html) {
            if (err) {
                console.log(err);
                return reject(err);
            }
            else if (res.statusCode !== 200) {
                err = new Error("Unexpected status code : " + res.statusCode);
                err.res = res;
                console.error(err);
                return reject(err);
            }
            var $ = cheerio.load(html);
            $('.poi-card-link').each(function () {
                let data = $(this);
                let link = data.attr("href");
                let url = "https://restaurant.michelin.fr/" + link;
                ListRestaurants.push({ "name": "", "postalCode": "", "chef": "", "url": url })
            });
            resolve(ListRestaurants);
        });
    });
}

//Getting all detailed info for the JSON file
function fillRestaurantInfo(url, index) {
    return new Promise(function (resolve, reject) {
        request(url, function (err, res, html) {
            if (err) {
                console.error(err);
                return reject(err);
            }
            else if (res.statusCode !== 200) {
                err = new Error("Unexpected status code : " + res.statusCode);
                err.res = res;
                console.error(err);
                return reject(err);
            }
            const $ = cheerio.load(html);
            $('.poi_intro-display-title').first().each(function () {
                let data = $(this);
                let name = data.text();
                name = name.replace(/\n/g, "");
                ListRestaurants[index].name = name.trim();
            });

            $('.postal-code').first().each(function () {
                let data = $(this);
                let pc = data.text();
                ListRestaurants[index].postalCode = pc;
            });
            $('#node_poi-menu-wrapper > div.node_poi-chef > div > div > div.field__items > div').first().each(function () {
                let data = $(this);
                let chefname = data.text();
                ListRestaurants[index].chef = chefname;
            });
            console.log("Added info of " + index + "th restaurant");
            resolve(ListRestaurants);
        });
    });
}

//Saving the file as RestaurantsMichelin.json
function saveRestaurantsInJson() {
    return new Promise(function (resolve) {
        try {
            console.log("Trying to write the restaurant's JSON file");
            var jsonRestaurants = JSON.stringify(ListRestaurants);

            fs.writeFile("RestaurantsMichelin.json", jsonRestaurants, function doneWriting(err) {
                if (err) { console.error(err); }
            });
        }
        catch (error) {
            console.error(error);
        }
        resolve();
    });
}



//Main()
createPromises();
Promise.all(ListPromises)
    .then(createIndividualPromises)
    .then(() => { return Promise.all(ListIndivPromises); })
    .then(createIndividualPromises)
    .then(() => { return Promise.all(ListIndivPromises); })
    .then(saveRestaurantsInJson)
    .then(() => { console.log("You successfuly saved restaurants JSON file") });

module.exports.getRestaurantsJSON = function () {
    return JSON.parse(fs.readFileSync("RestaurantsMichelin.json"));

};