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
    return await conn.query(query, options);
  } catch (err) {
	throw err;
  } finally {
	if (conn) return conn.end();
  }
}

exports.query = asyncFunction;