const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('freezer', 'sa', 'aHqz2bs5UIWZyMXHGedW', {
    host: 'mariadb',
    dialect: 'mariadb',
    dialectOptions: {
        timezone: process.env.db_timezone,
    }
});

exports.testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}