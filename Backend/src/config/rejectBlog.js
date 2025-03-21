const logger = require('./logger');
 
const client = require('./db.js');
const rejectOldPendingBlogs = async () => {
    try {
       
        const query = `
            UPDATE blogs
            SET blog_status = 'rejected'
            WHERE blog_status = 'pending'
            AND blog_id IN (
                SELECT blog_id
                FROM notifications
                WHERE is_read = FALSE
                AND created_at < NOW() - INTERVAL '24 hours'
            )
            RETURNING blog_id, user_id ,blog_title;
        `;

        const result = await client.query(query);

        if (result.rows.length > 0) {
            for (const blog of result.rows) {
                await client.query(`DELETE from notifications WHERE blog_id=$1`,[blog.blog_id])
            }
            for (const blog of result.rows) {
                const notificationText = `Blog with title " ${blog.blog_title} " has been automatically rejected because it was not viewed within 24 hours you can send it again.`;
                await client.query(`
                    INSERT INTO user_notifications (user_id, blog_id,blog_title,notification_text, is_read)
                    VALUES ($1, $2, $3, $4, FALSE)
                `, [blog.user_id, blog.blog_id,blog.blog_title,notificationText]);
            }
            for (const blog of result.rows) {
                const notificationText = `Blog with title " ${blog.blog_title} " has been automatically rejected because you not viewed it within 24 hours.`;
                await client.query(`
                    INSERT INTO notifications (user_id, blog_id,blog_title,notification_text, is_read)
                    VALUES ($1, $2, $3, $4, FALSE)
                `, [blog.user_id, blog.blog_id,blog.blog_title,notificationText]);
            }
            logger.info(`Automatically rejected ${result.rows.length} old pending blogs.`);
        } else {
            logger.info('No old pending blogs found to reject.');
        }
    } catch (error) {
        logger.error('Error rejecting old pending blogs:', error.message);
    }
};

const notifyAdminBeforeRejection = async () => {
    try {
        
        const query = `
            SELECT blog_id, user_id, blog_title
            FROM blogs
            WHERE blog_status = 'pending'
            AND blog_time BETWEEN NOW() - INTERVAL '24 hours' AND NOW() - INTERVAL '20 minutes'
        `;

        const result = await client.query(query);

        if (result.rows.length > 0) {
            for (const blog of result.rows) {
                // Insert notification for each blog
                const notificationText = `Blog with title "${blog.blog_title}" will be automatically rejected in 20 minutes.`;
                await client.query(
                    `INSERT INTO notifications (user_id, blog_id, blog_title, notification_text, is_read)
                     VALUES ($1, $2, $3, $4, FALSE)`,
                    [blog.user_id, blog.blog_id, blog.blog_title, notificationText]
                );

                logger.info(`Sent notification to admin for blog ID ${blog.blog_id}`);
            }
        } else {
            logger.info('No blogs need notification before rejection.');
        }
    } catch (error) {
        logger.error('Error notifying admin before rejection:', error.message);
    }
};


module.exports = {
    rejectOldPendingBlogs,
    notifyAdminBeforeRejection
};
