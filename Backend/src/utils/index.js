const DB_COMMANDS_ADMIN = {
    INSERT: 'INSERT INTO admin (admin_fname,admin_lname,admin_name, admin_email, admin_password, admin_access_token) VALUES ($1, $2, $3, $4,$5,$6) RETURNING *',
    SELECT: 'SELECT admin_email, admin_password, admin_access_token FROM admin WHERE admin_email = $1'
};

const DB_COMMANDS_USER = {
    INSERT: 'INSERT INTO users (user_fname, user_lname, user_name, user_email, user_password, user_access_token) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    SELECT: 'SELECT TRIM(user_email) AS user_email, TRIM(user_access_token) AS user_access_token, TRIM(user_password) AS user_password FROM users WHERE TRIM(user_email) = $1'
};

const DB_COMMANDS_CREATE_BLOG = {
    INSERT: 'INSERT INTO blogs (user_id, blog_title, blog_intro,blog_media,media_type,blog_additional_info, blog_status) VALUES ($1, $2, $3, $4, $5,$6,$7) RETURNING *',
    SELECT: 'SELECT user_id ,user_name FROM users WHERE user_email = $1'
};
const DB_ADMIN_FINDNAME={
    SELECT: 'SELECT * FROM admin WHERE admin_name = $1'
}

const DB_ADMIN_FINDEMAIL={
    SELECT: 'SELECT * FROM admin WHERE admin_email = $1'
}
const DB_USER_FINDNAME={
    SELECT: 'SELECT * FROM users WHERE user_name = $1'
}

const DB_USER_FINDEMAIL={
    SELECT: 'SELECT * FROM users WHERE user_email = $1'
}

const DB_USER_FIND_BLOG_ID={
    SELECT: 'SELECT COUNT(*) FROM shares WHERE blog_id = $1'
}
const DB_USER_BLOGSHARE={
    INSERT:`INSERT INTO shares (blog_id, user_id) 
             VALUES ($1, $2) 
             RETURNING *`
}
const DB_COMMANDS_ADD_COMMENT={
    INSERT: 'INSERT INTO comments (comment_text, blog_id, user_id) VALUES ($1, $2, $3) RETURNING *'
 }

const DB_USER_NOTIFICATION={
    INSERT:`INSERT INTO user_notifications(user_id,blog,id,notification_text) VALUES ($1,$2,$3) RETURNING *`
}
const DB_COMMENTS_USERNAME={
    SELECT :`select user_name  from users where user_id=$1`
}
const DB_COMMENTS_ID={
    SELECT :`select * from comments where blog_id=$1`
}


module.exports = { DB_COMMANDS_USER, DB_COMMANDS_ADMIN, DB_COMMANDS_CREATE_BLOG , DB_ADMIN_FINDEMAIL, DB_ADMIN_FINDNAME , DB_USER_FINDEMAIL, DB_USER_FINDNAME,DB_USER_FIND_BLOG_ID,DB_USER_BLOGSHARE,DB_COMMANDS_ADD_COMMENT,DB_USER_NOTIFICATION,DB_COMMENTS_USERNAME,
    DB_COMMENTS_ID
};
