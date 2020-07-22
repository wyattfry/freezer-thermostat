const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const database = require('./database.js');
const gpiop = require('rpi-gpio').promise;

const relay_pin = 11;
gpiop.setup(relay_pin, gpiop.DIR_OUT);

app.get('/state', (req, res) => {
	gpiop.read(relay_pin)
        .then(data => res.send(JSON.stringify({"isCooling": data})))
        .catch(error => {
            res.statusCode = 500;
            res.statusMessage = "Error reading from GPIO, i.e. cooling state. " + error;
            res.send();
            return;
        });
});

app.get('/temperature-history', (req, res) => {
    let parsedMinutes = Number.parseInt(req.query.minutes);
    const minimumMinutes = 1;
    const maximumMinutes = 480;
    if (parsedMinutes < minimumMinutes || parsedMinutes > maximumMinutes) {
        res.statusCode = 400;
        res.statusMessage = `Temperature history minutes must be an integer between ${minimumMinutes} and ${maximumMinutes} (inclusive).`;
        res.send();
        return;
    }
    const defaultMinutes = 90;
    const minutes = parsedMinutes || defaultMinutes;

    database.query("select datetime, tempC from freezer.temperature order by datetime desc limit ?", [minutes])
        .then(rows => res.send(JSON.stringify(rows.slice(0, minutes).reverse())))
        .catch(error => {
            console.error(error);
            res.status(500).send()
        });
});

app.get('/favicon.ico', (req, res) => {
	res.sendFile(path.join(__dirname + '/favicon.ico'));
});

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, () => console.log('Listening at http://localhost:3000'))
