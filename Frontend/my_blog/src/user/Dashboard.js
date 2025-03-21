// //dashboard.js
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import BlogContent from '../component/BlogContent';
// import Header from './Header';


// const Dashboard = ({ user, onSignOut }) => {
//   const [blogs, setBlogs] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchBlogs = async () => {
//         try {
//             const token = localStorage.getItem('accessToken');
          
//             if (!token) {
//                 throw new Error('No access token found');
//             }

//             const response = await axios.get('http://localhost:9001/user/getAcceptedBlogs', {
//                 headers: {
//                     'token': `${token}`
//                 }
//             });
//            console.log('response',response.data.blogs)
//               // Ensure response.data.blogs is an array
//         if (Array.isArray(response.data.blogs)) {
//           setBlogs(response.data.blogs);
//       } else {
//           throw new Error('Blogs data is not an array');
//       }
//       setLoading(false);
//         } catch (error) {
   
//             setError('Failed to fetch blogs. Please try again later.');
//             setLoading(false);
//         }
//     };

//     fetchBlogs();
// }, []);


//   const handleSearch = (searchQuery) => {
//     setSearchQuery(searchQuery);
//   };

//   if (loading) return <div className="text-center py-4">Loading...</div>;
//   if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

//   const filteredBlogs = Array.isArray(blogs) 
//   ? blogs.filter((blog) => blog.blog_title.toLowerCase().includes(searchQuery.toLowerCase()))
//   : []; // Fallback to an empty array if blogs is not an array
// console.log('filtered',filteredBlogs)
//   return (
//     <div>
//       <Header user={user} onSignOut={onSignOut} onSearch={handleSearch} />
//       <BlogContent blogs={filteredBlogs} />
//     </div>
//   );
// };

// export default Dashboard;//dashboard.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import BlogContent from '../component/BlogContent';
import Header from './Header';


const Dashboard = ({ user, onSignOut }) => {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
        try {
            const token = localStorage.getItem('accessToken');
          
            if (!token) {
                throw new Error('No access token found');
            }

            const response = await axios.get('http://localhost:9001/user/getAcceptedBlogs', {
                headers: {
                    'token': `${token}`
                }
            });
           
            setBlogs(response.data.blogs);
            setLoading(false);
        } catch (error) {
   
            setError('Failed to fetch blogs. Please try again later.');
            setLoading(false);
        }
    };

    fetchBlogs();
}, []);


  const handleSearch = (searchQuery) => {
    setSearchQuery(searchQuery);
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div>
      <Header user={user} onSignOut={onSignOut} onSearch={handleSearch} />
      <BlogContent blogs={blogs.filter((blog) => blog.blog_title.toLowerCase().includes(searchQuery.toLowerCase()))} />
    </div>
  );
};

export default Dashboard;