import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../services/contextapi_state_management/store';
import SignUp from './SignUP';
import { Login_main } from '../services/contextapi_state_management/action/action';

const SignIn = ({ onSignIn }) => {
    const { state, dispatch } = useContext(StoreContext);
    const [admin_email, setEmail] = useState('');
    const [admin_password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [showSignUpModal, setShowSignUpModal] = useState(false); // State to control modal visibility

    const handleSignIn = async (e) => {
        e.preventDefault();
        await Login_main(admin_email, admin_password, dispatch); // Dispatch is passed to main
    };

    useEffect(() => {
        if (state.data && !state.isError) {  // Check if data exists and no error
            onSignIn(state.data); // Call onSignIn with the token
        }
    }, [state.data, state.isError, onSignIn]); // Run this effect when state.data or state.isError changes

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Log In</h2>
                <form onSubmit={handleSignIn}>
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-2 mb-4 border rounded"
                            value={admin_email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'} // Toggle input type based on state
                            placeholder="Password"
                            className="w-full p-2 mb-4 border rounded pr-10" // Add padding-right for the icon
                            value={admin_password}
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
