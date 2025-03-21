const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const logger = require('./config/logger.js');
const { rejectOldPendingBlogs, notifyAdminBeforeRejection } = require('./config/rejectBlog.js');
const client = require('./config/db.js'); 
const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); 

// Routes
const allRoutes = require('./router/allRoutes.js');
app.use('/', allRoutes);

// Port connection
const PORT = process.env.PORT || 9001;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});


// rejectOldPendingBlogs();
// notifyAdminBeforeRejection();


// cron.schedule('* * * * *', rejectOldPendingBlogs);
// cron.schedule('* * * * *', notifyAdminBeforeRejection);
