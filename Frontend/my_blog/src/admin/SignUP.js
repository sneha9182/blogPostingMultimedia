import React, { useContext, useEffect, useState } from 'react';
import { SignUp_main } from '../services/contextapi_state_management/action/action';
import { StoreContext } from '../services/contextapi_state_management/store';

const SignUp = ({ closeModal }) => {
    const { state, dispatch } = useContext(StoreContext);
    const [admin_fname, setFirstName] = useState('');
    const [admin_lname, setLastName] = useState('');
    const [admin_name, setAdminName] = useState('');
    const [admin_email, setEmail] = useState('');
    const [admin_password, setPassword] = useState('');
    const [admin_confirm_password, setConfirmPassword] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (admin_password !== admin_confirm_password) {
            alert("Passwords do not match");
            return;
        }
        await SignUp_main(admin_fname, admin_lname, admin_name, admin_email, admin_password, admin_confirm_password,dispatch);
    };

    useEffect(() => {
      console.log("Current state:", state);
  }, [state]);
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold">Sign Up</h2>
                    <button 
                        className="text-gray-500 hover:text-gray-700" 
                        onClick={closeModal}
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p className="text-gray-600 mb-6">It's quick and easy.</p>
                <form onSubmit={handleSignUp}>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <input 
                            className="border rounded px-3 py-2" 
                            type="text" 
                            placeholder="First name"
                            value={admin_fname} 
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <input 
                            className="border rounded px-3 py-2" 
                            type="text" 
                            placeholder="Last name" 
                            value={admin_lname} 
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <input 
                        className="border rounded px-3 py-2 w-full mb-4" 
                        type="text" 
                        placeholder="User name" 
                        value={admin_name} 
                        onChange={(e) => setAdminName(e.target.value)}
                        required
                    />
                    <input 
                        className="border rounded px-3 py-2 w-full mb-4" 
                        type="email" 
                        placeholder="Email address" 
                        value={admin_email} 
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input 
                        className="border rounded px-3 py-2 w-full mb-4" 
                        type="password" 
                        placeholder="Password" 
                        value={admin_password} 
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input 
                        className="border rounded px-3 py-2 w-full mb-4" 
                        type="password" 
                        placeholder="Confirm password" 
                        value={admin_confirm_password} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <p className="text-xs text-gray-500 mb-6">
                        By clicking Sign Up, you agree to our <a href="#" className="text-blue-600">Terms</a>, <a href="#" className="text-blue-600">Privacy Policy</a> and <a href="#" className="text-blue-600">Cookies Policy</a>.
                    </p>
                    <button 
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full hover:bg-green-600"
                        type="submit"
                        disabled={state.isLoading}
                    >
                        {state.isLoading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                    {state.isError && <p className="text-red-500 mt-2">{state.errorMessage}</p>}
                </form>
            </div>
        </div>
    );
};

export default SignUp;
