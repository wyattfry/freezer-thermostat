const sensor = require('ds18x20');
const sensorId = '28-00000b91bae7';
const database = require('./database.js');
var gpiop = require('rpi-gpio').promise;

const config = {
  startCoolingTriggerTempC: -11,
  stopCoolingTriggerTempC: -12,
  minutesBetweenReadings: 1,
};

// TODO any advantage to using a state manager? e.g. Redux?
const state = {
  isCooling: () => gpiop.read(relay_pin),
  currentTempC: 100,
};

// TODO: If no temperature data, fall back to 15 min on, 15 off or whatever
// relay is on GPIO 17 (pin 11)
const relay_pin = 11;

gpiop.setup(relay_pin, gpiop.DIR_OUT)
    .then(() => {
        return gpiop.write(relay_pin, false)
    })
    .catch((err) => {
        console.log('Failed to set up GPIO.');
    });

function readAndRecord() {
  sensor.getAll((error, tempObj) => {
    if (error) {
      console.log("Error reading temperature sensor.");
      return;
    }

    const celsius = tempObj[sensorId];

    database.query("insert into freezer.temperature (datetime, tempC) values (current_timestamp, ?)", [celsius]);

    state.currentTempC = celsius;

    if (state.currentTempC > config.startCoolingTriggerTempC) {
      state.isCooling().then(relayOn => {
        if (!relayOn) {
          startCooling();
        }
      });
      return;
    }

    if (state.currentTempC < config.stopCoolingTriggerTempC) {
      state.isCooling().then(relayOn => {
        if (relayOn) {
          stopCooling();
        }
      });
      return;
    }
  });
}

console.log("Starting worker...");



database.initialize()
  .then(() => {
    console.log("Database ready.");
  })
  .catch(error => {
    console.log("Failed to initialize database.");
  })
  .finally(() => {
    readAndRecord();
    setInterval(readAndRecord, config.minutesBetweenReadings * 60 * 1000);
  });


function CtoF(tempC) {
  return (tempC * (9/5) + 32).toFixed(1);
}

// TODO replace 2 f()s with 1 toggle()
function startCooling() {
  gpiop.write(relay_pin, true)
    .then(() => {
      state.isCooling().then(pinState => {
        // TODO add state change to DB
        console.log(`${new Date().toJSON()} Start cooling. Current temp: ${state.currentTempC}, isCooling: ${pinState}, start temp: ${config.startCoolingTriggerTempC}°C, stop temp: ${config.stopCoolingTriggerTempC}°C`);
      });
    })
    .catch((err) => {
      // TODO add failed state change to DB
      console.log("Failed to turn on relay to start cooling", err);
    });

}

function stopCooling() {
  gpiop.write(relay_pin, false)
    .then( () => {
      state.isCooling().then(pinState => {
        // TODO add state change to DB
        console.log(`${new Date().toJSON()} Stop cooling. Current temp: ${state.currentTempC}°C, isCooling: ${pinState}, start temp: ${config.startCoolingTriggerTempC}°C, stop temp: ${config.stopCoolingTriggerTempC}°C`);
      });
    })
    .catch((err) => {
      // TODO add failed state change to DB
      console.log("Failed to turn off relay to stop cooling", err);
    });
}