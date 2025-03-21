module.exports = {
    createAdminTable: `
        CREATE TABLE IF NOT EXISTS admin (
            admin_id SERIAL PRIMARY KEY,
            admin_fname VARCHAR(100) NOT NULL,
            admin_lname VARCHAR(100) NOT NULL,
            admin_name VARCHAR(100) UNIQUE NOT NULL,
            admin_email VARCHAR(100) UNIQUE NOT NULL,
            admin_password TEXT NOT NULL,
            admin_access_token TEXT,
            admin_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            admin_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `,
    createUserTable: `
        CREATE TABLE IF NOT EXISTS users (
            user_id SERIAL PRIMARY KEY,
            user_fname VARCHAR(100) NOT NULL,
            user_lname VARCHAR(100) NOT NULL,
            user_name VARCHAR(100) UNIQUE NOT NULL,
            user_email VARCHAR(100) UNIQUE NOT NULL,
            user_password TEXT NOT NULL,
            user_access_token TEXT,
            user_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            user_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `,
    createBlogsTable: `
        CREATE TABLE IF NOT EXISTS blogs (
            blog_id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(user_id),
            blog_title VARCHAR(255) NOT NULL,
            blog_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            blog_intro TEXT NOT NULL,
            blog_media BYTEA,
            media_type VARCHAR(255),
            blog_additional_info TEXT,
            blog_status VARCHAR(100)
        );
    `,
    createCommentsTable: `
        CREATE TABLE IF NOT EXISTS comments (
            comment_id SERIAL PRIMARY KEY,
            comment_text TEXT NOT NULL,
            blog_id INTEGER REFERENCES blogs(blog_id),
            user_id INTEGER REFERENCES users(user_id),
            comment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `,
    createSharesTable: `
        CREATE TABLE IF NOT EXISTS shares (
            share_id SERIAL PRIMARY KEY,
            blog_id INTEGER REFERENCES blogs(blog_id),
            user_id INTEGER REFERENCES users(user_id),
            share_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `,
    adminNotificationTable:`CREATE TABLE IF NOT EXISTS notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id), 
    blog_id INTEGER REFERENCES blogs(blog_id),
       blog_title VARCHAR(255) ,
    notification_text VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`,
userNotificationTable:`CREATE TABLE IF NOT EXISTS user_notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    blog_id INTEGER REFERENCES blogs(blog_id),
       blog_title VARCHAR(255),
    notification_text VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    notification_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`
};
