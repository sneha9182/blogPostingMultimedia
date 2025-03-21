// blogModel.js
const logger = require('../config/logger');
const client = require('../config/db.js'); 
const update_blog_status = async (blog_id, status) => {
    try {
        await client.query(
            'UPDATE blogs SET blog_status = $1 WHERE blog_id = $2 Returning user_id',
            [status, blog_id]
        );
    } catch (err) {
        logger.error('Error updating blog status', { error: err.message });
        throw err;
    }
};
// blogModel.js

const get_accepted_blogs = async () => {
    try {
        const result = await client.query(
            'SELECT * FROM blogs WHERE blog_status = $1 ORDER BY blog_time DESC',
            ['accepted']
        );
        return result.rows;
    } catch (err) {
        logger.error('Error fetching accepted blogs', { error: err.message });
        throw err;
    }
};

module.exports = {
    update_blog_status,
    get_accepted_blogs
}