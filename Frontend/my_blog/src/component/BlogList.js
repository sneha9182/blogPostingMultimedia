import React from 'react';
import LetterCanvas from './LetterCanvas';
import TimeAgo from './Timeago';

const BlogList = ({ blogs }) => {
  return (
    <div className="bg-white-100 rounded-lg shadow border-black">
      <div className="space-y-3"> {/* This adds the vertical gap */}
        {blogs.map((blog, index) => {
          const firstLetter = blog.user_name.charAt(0).toUpperCase();

          const statusColor = blog.blog_status === 'pending' 
            ? 'bg-orange-500' 
            : blog.blog_status === 'accepted' 
            ? 'bg-green-500' 
            : 'bg-red-500';

          return (
            <div key={index} className="flex items-center p-4 bg-blue-100 last:border-b-0 shadow-md rounded-md">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4 text-white font-bold text-xl">
                <LetterCanvas letter={firstLetter} /> 
              </div>
              <div className="flex-1 gap-4 space-y-2">
                <div>
                  <p className="font-medium text-xl">{blog.blog_title}</p>
                  <p className="font-small">{blog.user_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{TimeAgo(blog.blog_time)}</p>
                </div>
              </div>
              <div className={`ml-auto px-3 py-1 text-white rounded ${statusColor}`}>
                {blog.blog_status}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BlogList;
