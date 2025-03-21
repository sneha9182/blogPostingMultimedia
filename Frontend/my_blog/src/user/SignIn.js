import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Login_main_google, Login_main_user } from '../services/contextapi_state_management/action/action';
import { StoreContext } from '../services/contextapi_state_management/store';
import SignUp from './SignUp';


const SignIn = ({ onSignIn }) => {
    const { state, dispatch } = useContext(StoreContext);
    const [user_email, setEmail] = useState('');
    const [user_password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const navigate = useNavigate();

    // Manual Sign-In function
    const handleSignIn = async (e) => {
        e.preventDefault();
        await Login_main_user(user_email, user_password, dispatch); // Dispatch manual login
    };


    // Google Login success response handler
    const responseGoogle = async (response) => {
        console.log('Google Sign-In Response:', response); // Log the response object
        const token = response.credential; // Extract Google token
        try {
            const decoded = jwtDecode(token);
            const user_email = decoded.email;
            // const user_password=decoded.name;
            console.log(decoded)
            onSignIn(user_email);
            navigate('/dashboard');
            await Login_main_google(user_email, dispatch); // Dispatch manual login
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    };

    useEffect(() => {
        if (state.data && !state.isError) {
            onSignIn(state.data); // Handle manual login success
            navigate('/dashboard'); // Redirect to dashboard
        }
    }, [state.data, state.isError, onSignIn, navigate]);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Log In</h2>
                
                {/* Manual Login Form */}
                <form onSubmit={handleSignIn}>
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-2 mb-4 border rounded"
                            value={user_email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            className="w-full p-2 mb-4 border rounded pr-10"
                            value={user_password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-2 text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded"
                        disabled={state.isLoading}
                    >
                        {state.isLoading ? 'Logging in...' : 'Log In'}
                    </button>
                    {state.isError && <p className="text-red-500 mt-2">{state.errorMessage}</p>}
                </form>
                
                {/* Google Login Button */}
                <div className="mt-4">
                    <GoogleLogin
                        onSuccess={responseGoogle}
                        onError={() => {
                            console.log('Google Login Failed');
                        }}
                    />
                </div>

                <p className="text-gray-600 mt-4">
                    Don't have an account? 
                    <button
                        type="button"
                        className="text-blue-500 ml-1"
                        onClick={() => setShowSignUpModal(true)}
                    >
                        Register
                    </button>
                </p>
            </div>
            
            {showSignUpModal && <SignUp closeModal={() => setShowSignUpModal(false)} />}
        </div>
    );
};

export default SignIn;