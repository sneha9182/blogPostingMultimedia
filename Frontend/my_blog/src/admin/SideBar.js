import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ showUsers, setShowUsers, showBlogs, setShowBlogs, setShowPendingBlogs ,showPendingBlogs, setShowAcceptedBlogs, showAcceptedBlogs, setShowRejectedBlogs, showRejectedBlogs}) => {
  return (
    <div className="w-64 bg-gray-800 text-white p-6">
      <h1 className="text-2xl font-bold mb-8">Admin</h1>
      <nav>
        <ul>
    
          <li className="mb-4">
          <Link 
              to="/dashboard/users" 
              className="flex items-center" 
              onClick={() => setShowUsers(!showUsers)}
            >
              
              <span className="mr-2">👥</span> Users
              
            </Link>
          </li>
          
          <li className="mb-4">
          <Link 
              to="/dashboard/blogs" 
              className="flex items-center" 
              onClick={() => setShowBlogs(!showBlogs)}
            >
              <span className="mr-2">📝</span> Blogs
            </Link>
          </li>
          <li className="mb-4">
          <Link 
              to="/dashboard/PendingBlogs" 
              className="flex items-center" 
              onClick={() => setShowPendingBlogs(!showPendingBlogs)}
            >
              <span className="mr-2">📝</span> Pending Blogs
            </Link>
          </li>
          <li className="mb-4">
          <Link 
              to="/dashboard/AcceptedBlogs" 
              className="flex items-center" 
              onClick={() => setShowAcceptedBlogs(!showAcceptedBlogs)}
            >
              <span className="mr-2">📝</span> Accepted Blogs
            </Link>
          </li>
          <li className="mb-4">
          <Link 
              to="/dashboard/RejectedBlogs" 
              className="flex items-center" 
              onClick={() => setShowRejectedBlogs(!showRejectedBlogs)}
            >
              <span className="mr-2">📝</span> Rejected Blogs
            </Link>
          </li>
        </ul>
      </nav>
      
    </div>
  );
};

export default Sidebar;
