require('dotenv').config();
const logger = require('../config/logger');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const admin_model = require('../model/adminModel');
const client = require('../config/db.js');
const { body, validationResult } = require('express-validator');
const notification_model = require('../model/notification_model');
const blog_model = require('../model/blog_model');

const SECRET_KEY = process.env.SECRET_KEY

// Register Function
const register = async (req, res) => {
    try {
        const { admin_fname,admin_lname,admin_name, admin_email, admin_password,admin_confirm_password } = req.body;
        //validation
        //Define minimum and maximum lengths
        const minNameLength = 3;
        const maxNameLength = 20; 
        const maxEmailLength = 30;
        const minPasswordLength = 8;
        const maxPasswordLength= 20;

         // Regular expression for validating first and last names (only alphabets)
         const nameRegex = /^[a-zA-Z\s]+$/;

     
         const adminNameRegex = /^[a-zA-Z0-9._]+$/;
 
         if (!admin_fname || !admin_lname || !admin_name || !admin_email || !admin_password || !admin_confirm_password) {
             return res.status(400).json({ success: false, message: 'All fields are required' });
         }
 
         if (typeof admin_fname !== 'string' || !nameRegex.test(admin_fname)) {
             return res.status(400).json({ success: false, message: 'First name not contains special characters' });
         }
 
         if (typeof admin_lname !== 'string' || !nameRegex.test(admin_lname)) {
             return res.status(400).json({ success: false, message: 'Last name not contains special characters' });
         }
 
         if (admin_fname.length < minNameLength || admin_fname.length > maxNameLength) {
             return res.status(400).json({ success: false, message: `First name must be between ${minNameLength} and ${maxNameLength} characters long` });
         }
 
         if (admin_lname.length < minNameLength || admin_lname.length > maxNameLength) {
             return res.status(400).json({ success: false, message: `Last name must be between ${minNameLength} and ${maxNameLength} characters long` });
         }
 
         if (admin_name.length < minNameLength || admin_name.length > maxNameLength) {
             return res.status(400).json({ success: false, message: `Admin name must be between ${minNameLength} and ${maxNameLength} characters long` });
         }
 
         if (!adminNameRegex.test(admin_name)) {
             return res.status(400).json({ success: false, message: 'Admin name can only contain alphabets, numbers, underscores, and periods' });
         }
 
         const existingAdminByName = await admin_model.findByAdminname(admin_name);
         const existingAdminByEmail = await admin_model.findByAdminEmail(admin_email);
 
         if (existingAdminByName) {
             logger.error('Duplicate admin name detected', { admin_name });
             return res.status(400).json({ success: false, message: 'Admin name already taken' });
         }
 
         if (existingAdminByEmail) {
             logger.error('Duplicate admin email detected', { admin_email });
             return res.status(400).json({ success: false, message: 'Admin Email already in use' });
         }
 
         if (admin_email.length > maxEmailLength) {
             return res.status(400).json({ success: false, message: `Email must be less than ${maxEmailLength} characters long` });
         }

         const emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;

         if (!emailRegex.test(admin_email)) {
             return res.status(400).json({ success: false, message: 'Invalid email format' });
         }
 
         if (admin_password.length < minPasswordLength) {
             return res.status(400).json({ success: false, message: `Password must be at least ${minPasswordLength} characters long` });
         }
 
         if (admin_password.length > maxPasswordLength) {
             return res.status(400).json({ success: false, message: `Password must not exceed ${maxPasswordLength} characters long` });
         }
 
         const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
         if (!passwordRegex.test(admin_password)) {
             return res.status(400).json({ success: false, message: 'Password must include at least one uppercase letter and one number' });
         }
 

        //verification

        const a=admin_password;
        const b=admin_confirm_password;
        // Hash the password
        if (a===b){
            const hashedPassword = await bcrypt.hash(admin_password, 10);

        // Generate a token
        const token = jwt.sign({ email: admin_email }, SECRET_KEY, { expiresIn: '24h' });

        // Save admin details in the database
        const newAdmin = await admin_model.add_admin_data(admin_fname,admin_lname,admin_name, admin_email, hashedPassword, token);

        // Log the registration
        logger.info('Admin registered successfully', { admin_email, token });

        // Respond with the token
        res.json({
            success: true,
            message: 'Admin registered successfully',
            token: token,
            admin: newAdmin
        });
        }
        else{
            logger.error('Invalid Password');
            res.status(500).send('Invalid Password');
        }
    } catch (err) {
        logger.error('Error during admin registration', { error: err.message });
        res.status(500).send(err.message);
    }
};
//backend-->admincontroller-->login function

const login = [
    // Validation
    body('admin_email')
        .isEmail().withMessage('Please provide a valid email address.')
        .normalizeEmail(),
    body('admin_password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
        .trim(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { admin_email, admin_password } = req.body;

            // Fetch admin data from the database
            const admin = await admin_model.check_admin_data(admin_email);

            if (!admin) {
                logger.warn('Invalid login attempt', { admin_email });
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // Compare the password
            const isPasswordValid = await bcrypt.compare(admin_password, admin.admin_password);

            if (!isPasswordValid) {
                logger.warn('Invalid login attempt', { admin_email });
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // Verify the existing token or generate a new one
            let token;
            try {
                token = jwt.verify(admin.admin_access_token, SECRET_KEY);
                var aat=admin.admin_access_token
                logger.info('Token verified successfully', { token });
            } catch (err) {
                aat = jwt.sign({ email: admin_email }, SECRET_KEY, { expiresIn: '1h' });
                logger.info('New token generated', { token });
                // Optionally update the token in the database
            }

            // Respond with the token
            res.json({
                success: true,
                message: 'Login successful',
                token: aat
            });
        } catch (err) {
            logger.error('Error during admin login', { error: err.message });
            res.status(500).send(err.message);
        }
    }
];
  
// Get users data from the users table
const getUsersData = async (req, res) => {
    try {
        
        const result = await client.query('SELECT * FROM users ORDER BY users.user_created_at DESC');
        logger.info('Fetched user data successfully');
        res.json(result.rows);
   

    } catch (error) {
        // Log the error and respond with an error message
        logger.error('Error fetching user data', { error: error.message });
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
        });
    }
 };

 //get blogs data
const getBlogsData = async (req, res) => {
    try {
        const result = await client.query('SELECT blogs.blog_title, blogs.blog_time,blogs.blog_status,users.user_name FROM blogs JOIN users ON blogs.user_id = users.user_id ORDER BY blogs.blog_time DESC');
        // Log the data fetching success
        logger.info('Fetched blogs data successfully');
        res.send(
            result.rows
        );
    
    } catch (error) {
        // Log the error and respond with an error message
        logger.error('Error fetching blogs data', { error: error.message });
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blogs data',
        });
    }
};



const getNotifications = async (req, res) => {
    try {
        const notifications = await notification_model.get_unread_notifications();
        res.json({ success: true, notifications });
    } catch (err) {
        logger.error('Error fetching notifications', { error: err.message });
        res.status(500).json({ success: false, message: 'Error fetching notifications' });
    }
};


const reviewBlog = async (req, res) => {
    try {
        const { blog_id, blog_title, action } = req.body;

        // Validate action
        if (action !== 'accept' && action !== 'reject') {
            return res.status(400).json({ success: false, message: 'Invalid action' });
        }

        // Update blog status based on the action
        const newStatus = action === 'accept' ? 'accepted' : 'rejected';
        
        // Update the blog status and get the user_id of the blog's author
        await blog_model.update_blog_status(blog_id, newStatus);
        
        // Get the user_id of the blog's author from the notifications table
        const result = await client.query('SELECT user_id FROM notifications WHERE blog_id = $1', [blog_id]);
        
        // Check if we got a result and extract the user_id
        if (result.rows.length === 0) {
            throw new Error('User ID not found');
        }
        
        const user_id = result.rows[0].user_id;
        
        // Notification text for user
        const user_notification_text = `Your blog titled "${blog_title}" has been "${newStatus}".`;

        const admin_notification_text = `You "${newStatus}" the "${blog_title}".`;

        // Insert a notification for the user
        await client.query(
            `INSERT INTO user_notifications (user_id, blog_id, blog_title, notification_text, is_read)
             VALUES ($1, $2, $3, $4, FALSE)`,
            [user_id, blog_id, blog_title, user_notification_text]
        );

        // Mark the original "pending" notification as read
        // await notification_model.mark_as_read(blog_id);

        // Delete the original "pending" notification
        // await notification_model.delete_notification(blog_id);
        await client.query(
            `INSERT INTO notifications (user_id, blog_id, blog_title, notification_text, is_read)
             VALUES ($1, $2, $3, $4, FALSE)`,
            [user_id, blog_id, blog_title, admin_notification_text]
        );

        logger.info(`New Blog ${blog_id} has been ${newStatus} and notifications updated`);
        res.json({ success: true, message:` New Blog ${newStatus} successfully and notifications updated.` });
    } catch (err) {
        logger.error('Error reviewing blog', { error: err.message });
        res.status(500).json({ success: false, message: 'Error reviewing blog' });
    }
};





const getPendingBlogs = async (req, res) => {
    try {
        const result = await client.query(`SELECT blogs.*, users.user_name FROM blogs JOIN users ON blogs.user_id = users.user_id WHERE blogs.blog_status = 'pending' ORDER BY blogs.blog_time DESC;`);
        logger.info('Fetched Pending blogs data successfully');
        res.send(
            result.rows
        );
    
    } catch (error) {
        logger.error('Error fetching Pending blogs', { error: error.message });
        res.status(500).json({
            success: false,
            message: 'Failed to fetch Pending blogs',
        });
    }
};


const getAcceptedBlogs = async (req, res) => {
    try {
        // SQL query to fetch all blogs with 'accepted' status
        const result = await client.query(`SELECT blogs.*, users.user_name FROM blogs JOIN users ON blogs.user_id = users.user_id WHERE blogs.blog_status = 'accepted' ORDER BY blogs.blog_time DESC;`);

        logger.info('Fetched Accepted blogs data successfully');
        res.send(
            result.rows
        );
    
    } catch (error) {
        // Log error and respond with a failure message
        logger.error('Error fetching Accepted blogs:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch Accepted blogs',
        });
    }
};


// Function to get all rejected blogs
const getRejectedBlogs = async (req, res) => {
    try {
        const result = await client.query(`SELECT blogs.*, users.user_name FROM blogs JOIN users ON blogs.user_id = users.user_id WHERE blogs.blog_status = 'rejected' ORDER BY blogs.blog_time DESC;`);
        
        logger.info('Fetched Rejected blogs data successfully');
        res.send(
            result.rows
        );
    
    } catch (error) {
        logger.error('Error fetching Rejected blogs:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch Rejected blogs',
        });
    }
};




const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete the notification from the admin's notifications table
        const result = await client.query('DELETE FROM notifications WHERE notification_id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Notification not found or already deleted' });
        }

        logger.info(`Notification with ID ${id} deleted by admin.`);
        res.status(200).json({ success: true, message: 'Notification deleted successfully' });
    } catch (error) {
        logger.error('Error deleting notification:', error.message);
        res.status(500).json({ success: false, message: 'Failed to delete notification' });
    }
};
const getDashboardStats = async (req, res) => {
    try {
      // Define SQL queries to count records
      const queries = {
        totalUsers: 'SELECT COUNT(*) FROM users',
        totalBlogs: 'SELECT COUNT(*) FROM blogs',
        totalComments: 'SELECT COUNT(*) FROM comments',
        totalShares: 'SELECT COUNT(*) FROM shares'
      };
  
      // Execute all queries concurrently
      const results = await Promise.all(
        Object.values(queries).map(query => client.query(query))
      );
  
      // Extract results
      const [totalUsersResult, totalBlogsResult, totalCommentsResult, totalSharesResult] = results;
      
      const totalUsers = parseInt(totalUsersResult.rows[0].count, 10);
      const totalBlogs = parseInt(totalBlogsResult.rows[0].count, 10);
      const totalComments = parseInt(totalCommentsResult.rows[0].count, 10);
      const totalShares = parseInt(totalSharesResult.rows[0].count, 10);
    
  
      // Fetch daily data
      const dailyData = await getDailyData();
  
      // Send response with statistics
      res.json({
        totalUsers,
        totalBlogs,
        totalComments,
        totalShares,
        dailyData
      });
    } catch (error) {
      // Log error and respond
      logger.error('Error fetching dashboard statistics:', { error: error.message });
      res.status(500).json({
        message: 'Error fetching statistics',
        error: error.message
      });
    }
  };
  
  // Example function to get daily data
  async function getDailyData() {
    try {
      const query = `
     SELECT 
        TO_CHAR(DATE(created_at), 'YYYY-MM-DD') as date,
        COUNT(CASE WHEN type = 'blog' THEN 1 END) as blogs,
        COUNT(CASE WHEN type = 'comment' THEN 1 END) as comments,
        COUNT(CASE WHEN type = 'share' THEN 1 END) as shares
      FROM (
        SELECT blog_time AS created_at, 'blog' as type FROM blogs
        UNION ALL
        SELECT comment_time AS created_at, 'comment' as type FROM comments
        UNION ALL
        SELECT share_time AS created_at, 'share' as type FROM shares
      ) as activities
      GROUP BY date
      ORDER BY date;
    `;
      
      const result = await client.query(query);
      console.log(result.rows)
      return result.rows;
    } catch (error) {
      logger.error('Error fetching daily data:', { error: error.message });
      return [];
    }
  }
  
  const notificationsCount = async (req, res) => {
    try {
        const result = await client.query('SELECT COUNT(*) FROM notifications');
        logger.info('Query result:', result.rows[0]); // Log query result
        const count = result.rows[0].count;
        res.json({ count });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
}
const getletter = async (req, res) => {
    try {
      const token = req.headers['token'];
      if (!token) {
        return res.status(401).json({ success: false, message: 'Access token is missing' });
      }
  
      // Verify the token and extract the user email
      let verified_data;
      try {
        verified_data = jwt.verify(token, SECRET_KEY);
      } catch (err) {
        logger.error('Token verification failed:', err.message);
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
      }
  
      const admin_email = verified_data.email;
    //   console.log(user_email);
  
    const query = 'SELECT SUBSTRING(admin_name, 1, 1) AS first_letter FROM admin WHERE admin_email = $1';
    const result = await client.query(query, [admin_email]);
  
 

    if (result.rows.length > 0) {
        const firstLetter = result.rows[0].first_letter;
       
        res.json({ firstLetter });
    } else {
        res.status(404).json({ message: 'User not found or no result returned' });
    }
    } catch (error) {
      logger.error('Error fetching user letter:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user letter',
      });
    }
  };

module.exports = {
    register,
    login,
    getUsersData,
    getBlogsData,
    getNotifications,
    reviewBlog,
    getPendingBlogs,
    getAcceptedBlogs,
    getRejectedBlogs,
    deleteNotification,
    getDashboardStats,
    notificationsCount,
    getletter

};
