const mariadb = require('mariadb');
const config = require('./config.js').config;

const pool = mariadb.createPool({
  host: 'mariadb',
  user: 'sa',
  password: config.dbpassword,
  connectionLimit: 5
});

exports.query = async (query, options) => {
  let conn;
  let result;
  try {
    conn = await pool.getConnection();
    result = await conn.query(query, options);
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.end();
  }

  return result;
}

exports.initialize = async () => {
  try {
    var rows = await exports.query("SHOW DATABASES");
    if (rows === undefined) {
      console.log("Creating db and tables...");
      await exports.query(`DROP DATABASE freezer`);
      await exports.query(`CREATE DATABASE freezer`);
      const temperatureQuery = `CREATE TABLE freezer.temperature (
           id MEDIUMINT NOT NULL AUTO_INCREMENT,
           datetime DATETIME NULL,
           tempC FLOAT(7,4) NULL,
           PRIMARY KEY (id)
       )`;
      const stateQuery = `CREATE TABLE freezer.state (
        id MEDIUMINT NOT NULL AUTO_INCREMENT,
        datetime DATETIME NULL,
        isCooling BOOLEAN NULL,
        currentTempC FLOAT(7,4) NULL,
        PRIMARY KEY (id)
      )`;
      await exports.query(temperatureQuery);
      await exports.query(stateQuery);
      await exports.query("INSERT INTO freezer.temperature (datetime, tempC) VALUES (CURRENT_TIMESTAMP, 0)");
      await exports.query("INSERT INTO freezer.state (datetime, isCooling, currentTempC) VALUES (CURRENT_TIMESTAMP, FALSE, 0)");
    }
    else {
      console.log("rows was !== null, skipping db and table creation.")
    }
  } catch (error) {
    console.error("Error executing query.", error);
  }
}