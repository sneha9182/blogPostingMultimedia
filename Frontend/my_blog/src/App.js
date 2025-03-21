
import React, { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import BlogDetail from './component/BlogDetail';
import UserNotifications from './component/UserNotifications';
import { StoreProvider } from './services/contextapi_state_management/store';
import BlogForm from './user/BlogForm';
import Dashboard from './user/Dashboard';
import SignIn from './user/SignIn';
// import Dashboard from './admin/Dashboard';
// import SignIn from './admin/SignIn';
const App = () => {
    const [user, setUser] = useState(null);
    const [notificationCount, setNotificationCount]=useState(0);
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        console.log('Token:', token); // Add this line for debugging
        if (token && token !== "null") {
            setUser({ token });
        }
    
        const fetchBlogs = async () => {
            try {
                const response = await fetch('http://localhost:9001/user/getblogs', {
                    headers: { 'token': token }
                });
                const data = await response.json();
                console.log('Blogs data:', data);
                console.log(data.data) // Add this line for debugging
                setBlogs(data.data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };
    
        fetchBlogs();
    }, []);
    
    
   


    const handleSignOut = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
        window.location.href = '/';
    };

    const handleSignIn = (token) => {
        if (token) {
            localStorage.setItem('accessToken', token);
            setUser({ token });
        }
    };

    return (
        <StoreProvider>

            <Router>
                <Routes>
               
                    {/* Existing routes */}
                    <Route path="/create-blog" element={user ? <BlogForm /> : <Navigate to="/" />} />
                    <Route
                        path="/"
                        element={
                            user ? <Navigate to="/dashboard" /> : <SignIn onSignIn={handleSignIn} />
                        }
                    />
                    <Route
                        path="/dashboard/*"
                        element={
                            user ? (
                                <Dashboard user={user} onSignOut={handleSignOut} />
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />
                     <Route path="/blogs/:blogId" element={<BlogDetail blogs={blogs} />} />
                    {/* <Route
                      path="/notifications"
                      element={
                        user? <AdminNotifications setNotificationCount={setNotificationCount} /> : <Navigate to="/"  />
                      } />  */}
                      <Route
                      path="/notifications"
                      element={
                        user? <UserNotifications setNotificationCount={setNotificationCount} /> : <Navigate to="/"  />
                      } />
                    <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
                </Routes>
            </Router>
        </StoreProvider>
    );
};

export default App;