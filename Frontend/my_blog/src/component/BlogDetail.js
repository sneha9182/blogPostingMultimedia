
import { faCommentDots, faShare, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FormatDate } from '../helper/FormatDate'
import { comment_main, commentsBlogId_main, commentUsername_main, share_main } from '../services/contextapi_state_management/action/action'
import { StoreContext } from '../services/contextapi_state_management/store'
import LetterCanvas from './LetterCanvas'

const BlogDetail = ({ blogs }) => {
  const { state, dispatch } = useContext(StoreContext);
  const { blogId } = useParams();
  const blog = blogs.find(b => b.blog_id === parseInt(blogId, 10));

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    if (blogId) {
      fetchComments();
    }
  }, [blogId]);

  const handleShareClick = async () => {
    setIsShareDialogOpen(true);
    try {
      const response = await axios.get('http://localhost:9001/admin/getUsersData', {
        headers: {
          'token': ` ${localStorage.getItem('accessToken')}` 
        }
      });
      setUsers(response.data);
    
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleShareSubmit = async () => {
    try {
        if (selectedUser) {
            await share_main(blogId, dispatch);
            setIsShareDialogOpen(false);
            const notification_text = `you have received a blog`;
           
            await axios.post('http://localhost:9001/user/addNotification', {
                user_id: selectedUser,  
                blog_id: blogId,       
                notification_text,
                blog_title:blog.blog_title
            });
            setSelectedUser('');
        }
    } catch (error) {
        console.error('Error sharing post:', error);
    }
};

const fetchComments = async () => {
  try {
    const fetchedComments = await commentsBlogId_main(blogId, dispatch);
    setComments(fetchedComments);
    
    const usernamePromises = fetchedComments.map(comment => 
      commentUsername_main(comment.user_id, dispatch)
    );
    const usernamesArray = await Promise.all(usernamePromises);

    const usernameMap = fetchedComments.reduce((acc, comment, index) => { 
      acc[comment.user_id] = usernamesArray[index];
      return acc;
    }, {});

    setUsernames(usernameMap);
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};

  const handleCommentClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = (dialogType) => {
    if (dialogType === 'comment') {
    setIsDialogOpen(false);
    }else if(dialogType === 'share'){
    setIsShareDialogOpen(false); 
    }
  };

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleCommentSubmit = async () => {
    try {
      await comment_main(commentText, blogId, dispatch); 
      const notification_text = `you have recieved a comment "${commentText}" on your blog`;
          console.log(blogs) 
      await axios.post('http://localhost:9001/user/addNotification', {
          user_id: blog.user_id,  
          blog_id: blogId,       
          notification_text,
          blog_title:blog.blog_title
      });
      setCommentText(''); 
      setIsDialogOpen(false); 
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  if (!blog) return <div >Loading...</div>;

  return (
    <div className="max-w-xl  mx-auto p-4 bg-blue-100 shadow-lg rounded-lg mt-8">
       
      <h2 className="text-3xl font-bold mb-4 text-center">{blog.blog_title}</h2>
      <div className=" justify-center items-center mr-4 ml-4">
      <div className="flex max-w-lg items-start justify-center center mb-4">
      {blog.blog_media && blog.media_type && blog.media_type.startsWith('image/') && (
              <img 
                src={`http://localhost:9001/user/getBlogMedia/${blog.blog_id}`} 
                alt={blog.blog_title} 
                className="w-full h-auto object-cover mb-2 rounded" 
              />
            )}
              {blog.blog_media && blog.media_type && blog.media_type.startsWith('video/') && (
              <video 
                src={`http://localhost:9001/user/getBlogMedia/${blog.blog_id}`} 
                controls 
                className="w-full h-auto object-cover mb-2 rounded"
              >
                Your browser does not support the video tag.
              </video>
            )}
  {/* <p className="text-xs text-gray-500 ml-4">{FormatDate(blog.blog_time)}</p> */}
</div>


      <p className="text-md text-gray-700 mb-1">{blog.blog_intro}</p>
      <div className="flex items-center justify-between mb-4">
        <p className="text-md font-medium text-green-600">{blog.user_name}</p>
        {/* <p className="text-xs text-gray-500">{FormatDate(blog.blog_time)}</p> */}
      </div>
      <p className="text-base text-gray-700 mb-4">{blog.blog_additional_info}</p>
      
      {/* Comment and Share Section with Icons */}
      <div className="flex justify-between mt-4">
        <div 
          className="flex items-center cursor-pointer text-blue-500 hover:text-blue-600"
          onClick={handleCommentClick}
        >
          <FontAwesomeIcon icon={faCommentDots} className="text-xl mr-2" />
          <span className="text-sm">Comment</span>
        </div>
        <div 
          className="flex items-center cursor-pointer text-blue-500 hover:text-gray-600"
          onClick={handleShareClick}
        >
          <FontAwesomeIcon icon={faShare} className="text-xl mr-2" />
          <span className="text-sm">Share</span>
        </div>
        </div>
      </div>
  
      {/* Comment Dialog */}
      {isDialogOpen && (
         <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg rounded-lg border border-gray-300">
         <div className="flex flex-col h-full relative">
           <button 
             className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
             onClick={() => handleDialogClose('comment')}
           >
             <FontAwesomeIcon icon={faTimes} className="text-lg" />
           </button>
           <div className="flex-grow p-6">
             <h3 className="text-xl font-semibold mb-4">Comments</h3>
             <div className="overflow-y-auto max-h-64">
             {Array.isArray(comments) && comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="mb-4 p-2 bg-gray-100 rounded">
                <p className="text-sm font-bold">@{usernames[comment.user_id] || 'Anonymous'}</p>
                <p className="text-sm">{comment.comment_text}</p>
                <p className="text-xs text-gray-500">{FormatDate(comment.comment_time)}</p>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
          </div>
             <textarea
               value={commentText}
               onChange={(e) => setCommentText(e.target.value)}
               rows="2"
               className="w-full border border-gray-300 rounded-lg p-2 resize-none mt-4"
               placeholder="Write your comment here..."
             />
           </div>
           <div className="p-6 flex justify-end space-x-2 bg-gray-100 border-t border-gray-300">
             <button 
               className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
               onClick={handleCommentSubmit}
             >
               Submit
             </button>
             <button 
               className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
               onClick={() => handleDialogClose('comment')}
             >
               Close
             </button>
           </div>
         </div>
       </div>
     )}
      
      {/* Share Dialog */}
      {isShareDialogOpen && (
  <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg rounded-lg border border-gray-300">
    <div className="flex flex-col h-full">

      <div className="flex-grow p-6 overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Share with a User</h3>

        <div className="space-y-4 max-h-75 overflow-y-auto">
          {users.map(user => {
            const firstLetter = user.user_name.charAt(0).toUpperCase();
            return (
              <div 
                key={user.user_id} 
                className="flex items-center justify-between p-2 border-b border-gray-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center mr-4 text-white font-bold text-xl">
                    <LetterCanvas letter={firstLetter} />
                  </div>
                  <span className="text-sm font-medium">{user.user_name}</span>
                </div>
                <input 
                  type="checkbox" 
                  value={user.user_id} 
                  checked={selectedUser === user.user_id}
                  onChange={() => setSelectedUser(user.user_id)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="p-6 flex justify-end space-x-2 bg-gray-100 border-t border-gray-300 sticky bottom-0">
        <button 
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={handleShareSubmit}
        >
          Share
        </button>
        <button 
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          onClick={() => handleDialogClose('share')}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


</div>
  )}
export default BlogDetail;
