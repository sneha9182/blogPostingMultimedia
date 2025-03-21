const logger = require('../config/logger.js');
const bcrypt = require('bcrypt');
const { DB_COMMANDS_USER, DB_COMMANDS_CREATE_BLOG,DB_USER_FINDEMAIL,DB_USER_FINDNAME,DB_USER_FIND_BLOG_ID, DB_USER_BLOGSHARE ,DB_COMMANDS_ADD_COMMENT, DB_USER_NOTIFICATION, DB_COMMENTS_ID, DB_COMMENTS_USERNAME} = require('../utils/index.js');
const client = require('../config/db.js');

const add_user_data = async (user_fname, user_lname, user_name, user_email, user_password, user_access_token) => {
    try {
        const result = await client.query(
            DB_COMMANDS_USER.INSERT,
            [user_fname, user_lname, user_name, user_email, user_password, user_access_token]
        );        
        logger.info('User data added successfully', { user_email });
        return result.rows[0];
    } catch (err) {
        logger.error('Error adding user data', { error: err.message, user_email });
        throw err;
    }
};

const check_user_data = async (user_email) => {
    try {
        const result = await client.query(
            DB_COMMANDS_USER.SELECT,
            [user_email]
        );
        if (result.rows.length === 0) {
            logger.warn('No user data found for email', { user_email });
        } else {
            logger.info('User data retrieved successfully', { user_email });
        }
        return result.rows[0];
    } catch (err) {
        logger.error('Error checking user data', { error: err.message, user_email });
        throw err; 
    }
};

// Function to get user details by email
const get_user_by_email = async (user_email) => {
    try {
        const result = await client.query(
            DB_COMMANDS_CREATE_BLOG.SELECT,
            [user_email]
        );

        if (result.rows.length > 0) {
            return result.rows[0];
        } else {
            return null;
        }
    } catch (err) {
        throw new Error('Error fetching user by email: ' + err.message);
    }
};

// create blog data
const create_blog_data = async (user_id, blog_title, blog_intro,blog_media,media_type,blog_additional_info, blog_status) => {
    try {
        const result = await client.query(
            DB_COMMANDS_CREATE_BLOG.INSERT,
            [user_id, blog_title, blog_intro, blog_media,media_type, blog_additional_info, blog_status]
        );

        logger.info('Blog data added successfully', { blog_title });
        return result.rows[0];
    } catch (err) {
        logger.error('Error adding blog data', { error: err.message, blog_title });
        throw err;
    }
};



const count_blogs = async (blog_id) => {
    try {
        const res = await client.query(
            DB_USER_FIND_BLOG_ID.SELECT,
            [blog_id]
        );
        const count = parseInt(res.rows[0].count, 10);
        // Return 1 if count is less than or equal to 5, otherwise return -1
        return count < 5 ? 1 : -1;
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};
const add_share_data = async (blog_id, user_id) => {
    try {
        const result = await client.query(
            DB_USER_BLOGSHARE.INSERT,
            [blog_id, user_id]
        );
        
        logger.info('Share data added successfully', { blog_id, user_id });
        return result.rows[0];
    } catch (err) {
        logger.error('Error adding share data', { error: err.message, blog_id, user_id });
        throw err;
    }
};
//user model.js
const add_comment = async (comment_text, blog_id, user_id) => {
    try {
        const result = await client.query(
            DB_COMMANDS_ADD_COMMENT.INSERT,
            [comment_text, blog_id, user_id]
        );
        
        logger.info('comment added successfully', { comment_text, blog_id });
        return result.rows[0];
    } catch (err) {
        logger.error('Error adding share data', { error: err.message, comment_text, blog_id});
        throw  err;
    }
};

const findByUsername = async (user_name) => {
    try {
        const query = DB_USER_FINDNAME.SELECT;
        const values = [user_name];
        const result = await client.query(query, values);
        
        return result.rows[0]; // Returns the user object if found, otherwise undefined
    } catch (err) {
        console.error('Error querying the database for user_name:', err);
        throw err;
    }
};

const findByUserEmail = async (user_email) => {
    try {
        const query = DB_USER_FINDEMAIL.SELECT;
        const values = [user_email];
        const result = await client.query(query, values);
        
        return result.rows[0]; // Returns the user object if found, otherwise undefined
    } catch (err) {
        console.error('Error querying the database for user_email:', err);
        throw err;
    }
};
const get_comments = async (blog_id) => {
    try {
        const result = await client.query(
            DB_COMMENTS_ID.SELECT,
            [blog_id]
        );

        if (result.rows.length > 0) {
            return result.rows;
        } else {
            return null;
        }
    } catch (err) {
        throw new Error('Error fetching user by email: ' + err.message);
    }
};
const get_username = async (user_id) => {
    try {
      const result = await client.query(DB_COMMENTS_USERNAME.SELECT, [user_id]);
  
      if (result.rows.length > 0) {
        return result.rows;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error('Error fetching user by user_id: ' + err.message);
    }
  };

  const check_user_name = async (user_email) => {
    try {
        const result = await client.query(
            DB_USER_FINDEMAIL.SELECT,
            [user_email]
        );
        if (result.rows.length === 0) {
            logger.warn('No user data found for email', { user_email });
            return null; // Return null if no user is found
        } else {
            logger.info('User data retrieved successfully', { user_email });
            return result.rows[0];
        }
    } catch (err) {
        logger.error('Error checking user data', { error: err.message, user_email });
        throw err; 
    }
};
  

module.exports = {
    add_user_data,
    check_user_data,
    create_blog_data,
    get_user_by_email,
    count_blogs,
    get_user_by_email,
    add_share_data,
    add_comment,
    findByUsername,
    findByUserEmail,
    get_comments,
    get_username,
    check_user_name
   

};
