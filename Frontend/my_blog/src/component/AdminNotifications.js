//a
import { Dialog } from '@headlessui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [preview, setPreview] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [selectedNotificationId, setSelectedNotificationId] = useState(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('http://localhost:9001/admin/getNotifications', {
                headers: { token:` ${localStorage.getItem('accessToken')} `}
            });
            setNotifications(response.data.notifications || []);
        } catch (err) {
            setError('Failed to fetch notifications');
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handlePreview = async (blogId, notificationId, notificationText) => {
        try {
            console.log(blogId)
           
            const response = await axios.get(`http://localhost:9001/admin/getBlogsData/${blogId}`, {
                headers: { token: `${localStorage.getItem('accessToken')} `}
            });

            if (response.data.success) {
                setPreview({
                    ...response.data.blogContent,
                    notificationText
                });
                setSelectedNotificationId(notificationId);
                console.log(notificationId)
                setShowPreview(true);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error('Error handling preview:', err);
            setError('Failed to handle preview');
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            await axios.delete(`http://localhost:9001/admin/deleteNotification/${notificationId}`, {
                headers: { token:` ${localStorage.getItem('accessToken')}` }
            });

            // Update state to remove the deleted notification
            setNotifications(prevNotifications => 
                prevNotifications.filter(notification => notification.id !== notificationId)
            );
            fetchNotifications();
        } catch (err) {
            console.error('Error deleting notification:', err);
            setError('Failed to delete notification');
        }
    };

    const handleReview = async (action) => {
        try {
            if (!preview || !preview.blog_id) {
                throw new Error('Blog preview data is missing');
            }

            const response = await axios.post('http://localhost:9001/admin/reviewBlog', {
                blog_id: preview.blog_id,
                blog_title: preview.blog_title,
                action: action
            }, {
                headers: { token:` ${localStorage.getItem('accessToken')}` }
            });

            if (response.data.success) {
                await deleteNotification(selectedNotificationId);
                setShowPreview(false);
                setError(null);
            } else {
                throw new Error(response.data.message || 'Failed to review blog');
            }
        } catch (err) {
            console.error('Error reviewing blog:', err);
            setError(`Failed to ${action} blog: ${err.message}`);
        }
    };

    const handleClosePreview = async () => {
       
        if (selectedNotificationId) {
            await deleteNotification(selectedNotificationId); // Ensure deletion is awaited
        }
        setShowPreview(false);
        setPreview(null);
        setSelectedNotificationId(null);
    };

    const handleClosePage = () => {
        navigate('/dashboard');
    };

    if (loading) return <p>Loading notifications...</p>;

    return (
        <div className="w-full max-w-4xl mx-auto mt-4 bg-blue-100 rounded-md shadow-lg p-4 relative">
            <button
                onClick={handleClosePage}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
            
            <h1 className="text-xl font-bold mb-2">Admin Notifications</h1>
            {error && <p className="text-red-500">{error}</p>}
            {notifications.length === 0 ? (
                <p>No notifications</p>
            ) : (
                <ul className="space-y-4">
                    {notifications.map(notification => (
                        <li key={notification.id} className={`p-4 rounded-md shadow-md w-full max-w-3xl mx-auto ${notification.notification_text.startsWith('Blog') ? 'bg-gray-200' : 'bg-blue-200'}`}>
                            <p className="font-semibold text-blue-800">{notification.blog_title}</p>
                            <p className={`text-blue-700 ${notification.notification_text.startsWith('Blog') ? 'text-gray-600' : ''}`}>{notification.notification_text}</p>
                            <button
                                onClick={() => handlePreview(notification.blog_id, notification.notification_id, notification.notification_text)}
                                className="mt-3 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                            >
                                Preview
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {showPreview && preview && (
                <Dialog
                    open={showPreview}
                    onClose={handleClosePreview}
                    className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70 flex items-center justify-center"
                >
                    <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full space-y-4 relative">
                        <button
                            onClick={handleClosePreview}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                        <h3 className="text-3xl  center font-bold text-gray-800">{preview.blog_title}</h3>
                        {/* {preview.blog_media && (
                            <img
                                src={preview.blog_media}
                                alt="Blog Media"
                                className="w-full h-auto rounded-lg shadow-md mb-4"
                            />
                        )} */}
                         <div className="flex max-w-lg items-start justify-center center mb-4">
                                {preview.blog_media && preview.media_type && preview.media_type.startsWith('image/') && (
                                        <img 
                                            src={`http://localhost:9001/user/getBlogMedia/${preview.blog_id}`} 
                                            alt={preview.blog_title} 
                                            className="w-full h-64 object-cover mb-2 rounded" 
                                        />
                                        )}
                                        {preview.blog_media && preview.media_type && preview.media_type.startsWith('video/') && (
                                        <video 
                                            src={`http://localhost:9001/user/getBlogMedia/${preview.blog_id}`} 
                                            controls 
                                            className="w-full h-64 object-cover mb-2 rounded"
                                        >
                                            Your browser does not support the video tag.
                                        </video>
                                        )}
                            {/* <p className="text-xs text-gray-500 ml-4">{FormatDate(blog.blog_time)}</p> */}
                            </div>
                        <p className="text-lg text-gray-700 mb-4">{preview.blog_intro}</p>
                        <p className="text-sm text-gray-600">{preview.blog_additional_info}</p>
                        <p className="text-sm text-gray-600">{preview.notificationText}</p>
                        <div className="flex justify-end space-x-4 mt-6">
                            {(preview.notificationText && (preview.notificationText.startsWith('You') || preview.notificationText.startsWith('Blog'))) ? (
                                <button
                                    onClick={handleClosePreview}
                                    className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Close Preview
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleClosePreview}
                                        className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        Close Preview
                                    </button>
                                    <button
                                        onClick={() => handleReview('accept')}
                                        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleReview('reject')}
                                        className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        Reject
                                    </button>
                                </>
                            )}
                        </div>
                    </Dialog.Panel>
                </Dialog>
            )}
        </div>
    );
};

export default AdminNotifications;