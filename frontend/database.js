const mariadb = require('mariadb');
const config = require('./config.js').config;

const pool = mariadb.createPool({
     host: 'localhost',
     user:'sa',
     password: config.dbpassword,
     connectionLimit: 5
});

async function asyncFunction(query, options) {
  let conn;
  try {
    conn = await pool.getConnection();
    result = await conn.query(query, options);
  } catch (err) {
	throw err;
  } finally {
	if (conn) {
        conn.end();
    }
  }
  return result;
}

exports.query = asyncFunction;