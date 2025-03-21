const logger = require('../config/logger');
const client = require('../config/db.js'); 

const create_notification = async (user_id, blog_id,blog_title, notification_text) => {
    try {
        const result = await client.query(
          ` INSERT INTO notifications (user_id, blog_id,blog_title, notification_text) VALUES ($1, $2, $3, $4) RETURNING *`,
            [user_id, blog_id,blog_title,notification_text]
        );

        logger.info(`Notification created successfully for blog ${blog_id}`);
        return result.rows[0];
    } catch (err) {
        logger.error('Error creating notification', { error: err.message });
        throw err;
    }
};

const get_unread_notifications = async () => {
    try {
        const result = await client.query(
            'SELECT * FROM notifications WHERE is_read = FALSE ORDER BY created_at DESC'
        );
        return result.rows;
    } catch (err) {
        logger.error('Error fetching unread notifications', { error: err.message });
        throw err;
    }
};



const mark_as_read = async (blog_id) => {
    try {
        await client.query(
            'UPDATE notifications SET is_read = TRUE WHERE blog_id = $1 ORDER BY notifications.created_at DESC',
            [blog_id]
        );
      
        await client.query('DELETE FROM notifications WHERE blog_id = $1 AND is_read = TRUE;',[blog_id])
    } catch (err) {
        logger.error('Error marking notification as read', { error: err.message });
        throw err;
    }
};

// const mark_as_read_user = async (blog_id) => {
//     try {
//         await client.query(
//             'UPDATE user_notifications SET is_read = TRUE WHERE blog_id = $1',
//             [blog_id]
//         );
//     } catch (err) {
//         logger.error('Error marking user notification as read', { error: err.message });
//         throw err;
//     }
// };

// const delete_notification = async (blog_id) => {
//     const query = `
//         DELETE FROM notifications
//         WHERE blog_id = $1
//         AND is_read = TRUE;
//     `;
//     await client.query(query, [blog_id]);
// };

// const delete_notification_user = async (req,res) => {
//     const{notification_id}=req.body;
//     const query = `
//         DELETE FROM user_notifications
//         WHERE notification_id = $1;
//     `;
//     await client.query(query, [blog_id]);
// };


module.exports = {
    create_notification,
    get_unread_notifications,
    mark_as_read
}