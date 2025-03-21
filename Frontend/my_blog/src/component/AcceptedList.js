import axios from 'axios';
import { useState } from 'react';
import LetterCanvas from './LetterCanvas';
import TimeAgo from './Timeago';

const AcceptedList = ({ accepted }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const handlePreview = (blog) => {
    setSelectedBlog(blog);
    setIsDialogOpen(true);
  };

  const handleClosePreview = () => {
    setIsDialogOpen(false);
    setSelectedBlog(null);
  };
  const handleReview = async (action) => {
    try {
        console.log('accepted',selectedBlog)
        const response = await axios.post('http://localhost:9001/admin/reviewBlog', {
            blog_id: selectedBlog.blog_id,
            blog_title: selectedBlog.blog_title,
            action: action
        }, {
            headers: { token:` ${localStorage.getItem('accessToken')}` }
        });

        if (response.data.success) {
          console.log('blog rejected')

      } else {
          throw new Error(response.data.message || 'Failed to review blog');
      }
       
        setIsDialogOpen(false);
    } catch (err) {
        console.error('Error reviewing blog:', err);
        // setError(`Failed to ${action} blog: ${err.message}`);
    }
};

 

  return (
    <div className="bg-white-100 rounded-lg shadow border-black">
      <div className="space-y-3">
        {accepted.map((acceptedBlog, index) => {
          const firstLetter = acceptedBlog.user_name.charAt(0).toUpperCase();
          return (
            <div key={index} className="flex items-center p-4 bg-blue-100 last:border-b-0 shadow-md rounded-md">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4 text-white font-bold text-xl">
                <LetterCanvas letter={firstLetter} />
              </div>
              <div className="flex-1 gap-4 space-y-2">
                <div>
                  <p className="font-medium text-xl">{acceptedBlog.blog_title}</p>
                  <p className="font-small">{acceptedBlog.user_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{TimeAgo(acceptedBlog.blog_time)}</p>
                </div>
              </div>
              <div className="ml-auto">
                <button
                  onClick={() => handlePreview(acceptedBlog)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                >
                  Preview
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dialog Box */}
      {isDialogOpen && selectedBlog && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-96 shadow-lg">
           <center> <h2 className="text-xl font-semibold mb-4">{selectedBlog.blog_title}</h2></center>
            <p className="text-gray-600 mb-6">{selectedBlog.blog_intro}</p>
            <p className="text-gray-600 mb-6">{selectedBlog.blog_additional_info}</p>

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleClosePreview}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
              >
                Close Preview
              </button>
             
              <button
                onClick={() => handleReview('reject')}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcceptedList;
