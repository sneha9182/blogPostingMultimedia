const logger = require('../config/logger');
const bcrypt = require('bcrypt');
const { DB_COMMANDS_ADMIN,DB_ADMIN_FINDEMAIL,DB_ADMIN_FINDNAME } = require('../utils/index.js');
const client = require('../config/db.js'); 

const add_admin_data = async (admin_fname,admin_lname,admin_name, admin_email, admin_password, admin_access_token) => {
    try {
        const result = await client.query(
            DB_COMMANDS_ADMIN.INSERT,
            [admin_fname,admin_lname,admin_name, admin_email, admin_password, admin_access_token]
        );
        logger.info('Admin data added successfully', { admin_email });
        return result.rows[0];
    } catch (err) {
        logger.error('Error adding admin data', { error: err.message, admin_email });
        throw err;
    }
};
//backend-->adminmodel-->check_admin_data function
const check_admin_data = async (admin_email) => {
    try {
        const result = await client.query(
            DB_COMMANDS_ADMIN.SELECT,
            [admin_email]
        );
        if (result.rows.length === 0) {
            logger.warn('No admin data found for email', { admin_email });
        } else {
            logger.info('Admin data retrieved successfully', { admin_email });
        }
        return result.rows[0];
        
    } catch (err) {
        logger.error('Error checking admin data', { error: err.message, admin_email });
        throw err; 
    }
};
const findByAdminname = async (admin_name) => {
    try {
        const query = DB_ADMIN_FINDNAME.SELECT;
        const values = [admin_name];
        const result = await client.query(query, values);
        
        return result.rows[0]; // Returns the user object if found, otherwise undefined
    } catch (err) {
        console.error('Error querying the database for admin_name:', err);
        throw err;
    }
};

const findByAdminEmail = async (admin_email) => {
    try {
        const query = DB_ADMIN_FINDEMAIL.SELECT;
        const values = [admin_email];
        const result = await client.query(query, values);
        
        return result.rows[0]; // Returns the user object if found, otherwise undefined
    } catch (err) {
        console.error('Error querying the database for admin_email:', err);
        throw err;
    }
};





module.exports = {
    add_admin_data,
    check_admin_data,
    findByAdminEmail,
    findByAdminname
};
