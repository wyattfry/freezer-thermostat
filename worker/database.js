const mariadb = require('mariadb');
const config = require('./config.js').config;

const pool = mariadb.createPool({
     host: 'mariadb',
     user:'sa',
     password: config.dbpassword,
     connectionLimit: 5
});

exports.query = async (query, options) => {
  let conn;
  try {
    conn = await pool.getConnection();
    return await conn.query(query, options);
  } catch (err) {
	throw err;
  } finally {
	if (conn) return conn.end();
  }
}

exports.initialize = async () => {
  // test connectivity
  exports.query("show databases;")
    .then(rows => {
      if (rows === undefined) {
        console.log("Creating database `freezer`");
        exports.query("CREATE DATABASE freezer;")
          .then(result => {
            console.log("Created database", result);
          })
          .catch( )
      }
      else {
        console.log("Rows", rows);
      }
    })
    .catch(error => console.log("Error executing query."));
  // if tables and schema not expected, add them, seed
}