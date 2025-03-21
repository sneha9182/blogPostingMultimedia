import axios from 'axios'; // Make sure you have axios installed or use fetch
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import AcceptedList from '../component/AcceptedList';
import BlogList from '../component/BlogList';
import PendingList from '../component/PendingList';
import RejectedList from '../component/RejectedList';
import UserList from '../component/UserList';
import { GetAcceptedBlogsData, GetBlogsData, GetPendingBlogsData, GetRejectedBlogsData, GetUsersData } from './GetComponents';
import Header from './Header';
import Sidebar from './SideBar';
const testData = [
  { date: '2024-09-01', blogs: 5, comments: 10, shares: 3 },
  { date: '2024-09-02', blogs: 3, comments: 7, shares: 2 }
];
const Dashboard = ({ user, onSignOut }) => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  const { usersData, isLoading: isUsersLoading, errorMessage: usersError, fetchUsersData } = GetUsersData();
  const { blogsData, isLoading: isBlogsLoading, errorMessage: blogsError, fetchBlogsData } = GetBlogsData();
  const { pendingBlogsData, isLoading: isPendingBlogsLoading, errorMessage: pendingBlogsError, fetchPendingBlogsData } = GetPendingBlogsData();
  const { acceptedBlogsData, isLoading: isAcceptedBlogsLoading, errorMessage: acceptedBlogsError, fetchAcceptedBlogsData } = GetAcceptedBlogsData();
  const { rejectedBlogsData, isLoading: isRejectedBlogsLoading, errorMessage: rejectedBlogsError, fetchRejectedBlogsData } = GetRejectedBlogsData();

  const [showUsers, setShowUsers] = useState(false);
  const [showBlogs, setShowBlogs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showPendingBlogs, setShowPendingBlogs] = useState(false);
  const [showAcceptedBlogs, setShowAcceptedBlogs] = useState(false);
  const [showRejectedBlogs, setShowRejectedBlogs] = useState(false);
  // State for statistics and charts
  const [stats, setStats] = useState({
    totalUsers:0,
    totalBlogs: 0,
    totalComments: 0,
    totalShares: 0,
    dailyData: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:9001/admin/getDashboardStats');
        setStats(response.data);
      
      } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      switch (location.pathname) {
        case '/dashboard':
          await fetchBlogsData();
          setDataLoaded(true);
          break;
        case '/dashboard/users':
          await fetchUsersData();
          setDataLoaded(true);
          break;
        case '/dashboard/blogs':
          await fetchBlogsData();
          setDataLoaded(true);
          break;
        case '/dashboard/PendingBlogs':
          await fetchPendingBlogsData();
          setDataLoaded(true);
          break;
        case '/dashboard/AcceptedBlogs':
          await fetchAcceptedBlogsData();
          setDataLoaded(true);
          break;
        case '/dashboard/RejectedBlogs':
          await fetchRejectedBlogsData();
          setDataLoaded(true);
          break;
        default:
          break;
      }
    };
  
    if (location.pathname !== currentPath) {
      setCurrentPath(location.pathname);
      setDataLoaded(false); // Reset data loaded flag before fetching
      loadData();
    }
  }, [location.pathname, currentPath, fetchUsersData, fetchBlogsData, fetchPendingBlogsData, fetchAcceptedBlogsData, fetchRejectedBlogsData]);

  // Filter users and blogs based on search query
  const filteredUsers = usersData.filter(user =>
    user.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.user_email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBlogs = blogsData.filter(blog =>
    blog.blog_title?.toLowerCase().includes(searchQuery.toLowerCase())
  );
 // Filter for pending blogs
const filteredPendingBlogs = pendingBlogsData.filter(blog =>
  blog.blog_status === 'pending' && 
  blog.blog_title?.toLowerCase().includes(searchQuery.toLowerCase())
);

// Filter for accepted blogs
const filteredAcceptedBlogs = acceptedBlogsData.filter(blog =>
  blog.blog_status === 'accepted' && 
  blog.blog_title?.toLowerCase().includes(searchQuery.toLowerCase())
);

// Filter for rejected blogs
const filteredRejectedBlogs = rejectedBlogsData.filter(blog =>
  blog.blog_status === 'rejected' && 
  blog.blog_title?.toLowerCase().includes(searchQuery.toLowerCase())
);


  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        showUsers={showUsers} 
        setShowUsers={setShowUsers} 
        showBlogs={showBlogs} 
        setShowBlogs={setShowBlogs} 
        showPendingBlogs={showPendingBlogs}
        setShowPendingBlogs={setShowPendingBlogs}
        showAcceptedBlogs={showAcceptedBlogs}
        setShowAcceptedBlogs={setShowAcceptedBlogs}
        showRejectedBlogs={showRejectedBlogs}
        setShowRejectedBlogs={setShowRejectedBlogs}
      />
      <div className="flex-1 flex flex-col p-6">
        <Header user={user} onSignOut={onSignOut} setSearchQuery={setSearchQuery} />

       {/* Loading indicator */}
       {(isUsersLoading || isBlogsLoading || isPendingBlogsLoading || isAcceptedBlogsLoading || isRejectedBlogsLoading) && !dataLoaded && <p>Loading data...</p>}

    {/* Error message */}
    {(usersError || blogsError || pendingBlogsError || acceptedBlogsError || rejectedBlogsError) && <p className="text-red-500">{usersError || blogsError || pendingBlogsError || acceptedBlogsError || rejectedBlogsError}</p>}

        {/* Default Dashboard */}
        {currentPath === '/dashboard' && (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-pink-100 p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">Total Users</h2>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">Total Blogs</h2>
                <p className="text-3xl font-bold">{stats.totalBlogs}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">Total Comments</h2>
                <p className="text-3xl font-bold">{stats.totalComments}</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">Total Shares</h2>
                <p className="text-3xl font-bold">{stats.totalShares}</p>
              </div>
            </div>

            <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Daily Activity Overview</h2>
        <div className="h-80 bg-white p-4 rounded-lg shadow">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="blogs" fill="#8884d8" name="Blogs" />
              <Bar dataKey="comments" fill="#82ca9d" name="Comments" />
              <Bar dataKey="shares" fill="#ffc658" name="Shares" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
          </>
        )}

        {/* Display Users Data */}
        {currentPath === '/dashboard/users' && dataLoaded && filteredUsers.length > 0 && showUsers && (
         <UserList users={filteredUsers} />
        )}

        {/* Display Blogs Data */}
        {currentPath === '/dashboard/blogs' && dataLoaded && filteredBlogs.length > 0 && showBlogs && (
         
          <BlogList blogs={filteredBlogs} />
        )}
        {/* Display Pending Blogs */}
        {currentPath === '/dashboard/PendingBlogs' && dataLoaded && filteredPendingBlogs.length > 0 && showPendingBlogs && (
        
          <PendingList pending={filteredPendingBlogs}/>
        )}

        {/* Display Accepted Blogs */}
        {currentPath === '/dashboard/AcceptedBlogs' && dataLoaded && filteredAcceptedBlogs.length > 0 && showAcceptedBlogs && (
          <AcceptedList accepted={filteredAcceptedBlogs}/>
        )}

        {/* Display Rejected Blogs */}
        {currentPath === '/dashboard/RejectedBlogs' && dataLoaded && filteredRejectedBlogs.length > 0 && showRejectedBlogs && (
           <RejectedList rejected={filteredRejectedBlogs}/>
        )}
        {/* No data messages for users */}
{currentPath === '/dashboard/users' && dataLoaded && filteredUsers.length === 0 && !isUsersLoading && !usersError && (
  <p>No users data available.</p>
)}

{/* No data messages for blogs */}
{currentPath === '/dashboard/blogs' && dataLoaded && filteredBlogs.length === 0 && !isBlogsLoading && !blogsError && (
  <p>No blogs data available.</p>
)}

{/* No data messages for pending blogs */}
{currentPath === '/dashboard/PendingBlogs' && dataLoaded && filteredPendingBlogs.length === 0 && !isPendingBlogsLoading && !pendingBlogsError && (
  <p>No pending blogs data available.</p>
)}

{/* No data messages for accepted blogs */}
{currentPath === '/dashboard/AcceptedBlogs' && dataLoaded && filteredAcceptedBlogs.length === 0 && !isAcceptedBlogsLoading && !acceptedBlogsError && (
  <p>No accepted blogs data available.</p>
)}

{/* No data messages for rejected blogs */}
{currentPath === '/dashboard/RejectedBlogs' && dataLoaded && filteredRejectedBlogs.length === 0 && !isRejectedBlogsLoading && !rejectedBlogsError && (
  <p>No rejected blogs data available.</p>
)}

       
      </div>
    </div>
  );
};
export default Dashboard;