const dotenv = require('dotenv');
dotenv.config();
const { Client } = require('pg');
const logger = require('./logger');
const schemas = require('../schema/Tables');


// Create a new client instance using environment variables
const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
};

const client = new Client(config);
client.connect()
    .then(async () => {
        logger.info('Connected to the database successfully');
        // Create tables
        await client.query(schemas.createAdminTable);
        await client.query(schemas.createUserTable);
        await client.query(schemas.createBlogsTable);
        await client.query(schemas.createCommentsTable);
        await client.query(schemas.createSharesTable);
        await client.query(schemas.adminNotificationTable);
        await client.query(schemas.userNotificationTable);
        logger.info('Tables created successfully or already exist');
    })
    .catch(err => logger.error('Failed to connect to the database', { error: err.stack }));

module.exports = client;
