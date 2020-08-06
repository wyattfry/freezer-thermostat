const database = require('./database.js');

exports.seed = async () => {
    let query = "";
    const startDateTime = "2020-01-01 00:00:00"; // TODO get this
    for (let i = 0; i < 100; i++) {
        query += `INSERT INTO freezer.temperature (datatetime, tempC) VALUES (${startDateTime - i}, ${Math.sin(i) - 11});`;
    }
    await database.query(query);
}