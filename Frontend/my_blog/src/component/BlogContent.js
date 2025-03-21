import { useNavigate } from 'react-router-dom';
import { FormatDate } from '../helper/FormatDate';
import TimeAgo from './Timeago';

const BlogContent = ({ blogs }) => {
  const navigate = useNavigate(); 

  if (!Array.isArray(blogs)) return <div className="text-center py-4">Invalid blogs data.</div>;

  const handleBlogClick = (blogId) => {
    if (blogId) {
      navigate(`/blogs/${blogId}`); 
    } else {
      console.error('Invalid blogId:', blogId);
    }
  };

  if (blogs.length === 0) return <div className="text-center py-4">No blogs available.</div>;

  return (
    <div className="bg-white p-6">
      <h2 className="text-xl font-semibold mb-4">Latest Blogs</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div 
            key={blog.blog_id} 
            className="flex flex-col border border-gray-200 rounded-lg p-4 relative cursor-pointer" 
            onClick={() => handleBlogClick(blog.blog_id)} 
          >
            {blog.blog_media && blog.media_type && blog.media_type.startsWith('image/') && (
              <img 
                src={`http://localhost:9001/user/getBlogMedia/${blog.blog_id}`} 
                alt={blog.blog_title} 
                className="w-full h-64 object-cover mb-2 rounded" 
              />
            )}

            {blog.blog_media && blog.media_type && blog.media_type.startsWith('video/') && (
              <video 
                src={`http://localhost:9001/user/getBlogMedia/${blog.blog_id}`} 
                controls 
                className="w-full h-64 object-cover mb-2 rounded"
              >
                Your browser does not support the video tag.
              </video>
            )}
             <h3 className="text-xl font-bold mb-1">{blog.blog_title}</h3>
          
           
            <p className="text-sm text-gray-600 mb-2">{blog.blog_intro}</p>
            <div className="flex items-center mt-auto">
              {/* <div>
                <p className="text-sm font-medium text-green-600">{blog.user_name}</p>
                <p className="text-xs text-gray-500">
                  {blog.blog_additional_info}
                </p>
              </div> */}
            </div>
            <div className='flex gap-56'>
            <p className="text-xs text-gray-400 mt-2 ">{FormatDate(blog.blog_time)}</p>
            <p className='text-gray-400 text-xs mt-2 '>{TimeAgo(blog.blog_time)}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogContent;
