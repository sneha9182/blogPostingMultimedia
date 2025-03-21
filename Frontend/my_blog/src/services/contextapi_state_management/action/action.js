import axios from 'axios';
import { FAILED, REQUEST, SUCCESS } from "../type/type";

export const Request = () => ({ type: REQUEST });

export const Success = (payload) => ({
    type: SUCCESS,
    payload
});

export const Failed = (payload) => ({
    type: FAILED,
    payload
});

export const Login_main = async (admin_email, admin_password, dispatch) => {
    dispatch(Request());
    try {
        const response = await axios.post('http://localhost:9001/admin/login', {
            admin_email,
            admin_password
        });

        if (response.data.success) {
            dispatch(Success(response.data.token));
        } else {
            dispatch(Failed(response.data.message));
        }
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : 'An error occurred. Please try again.';
        dispatch(Failed(errorMessage));
    }
};

export const SignUp_main = async (
    admin_fname, 
    admin_lname, 
    admin_name, 
    admin_email, 
    admin_password, 
    admin_confirm_password, 
    dispatch
) => {
    dispatch(Request());
    try {
        console.log("Dispatching request");
        const response = await axios.post('http://localhost:9001/admin/register', {
            admin_fname,
            admin_lname,
            admin_name,
            admin_email,
            admin_password,
            admin_confirm_password
        });
        console.log("Response received", response.data);
        if (response.data.success) {
            console.log("Sign-up successful, dispatching success");
            dispatch(Success(response.data.token));
        } else {
            console.log("Sign-up failed, dispatching failed");
            dispatch(Failed(response.data.message));
        }
    } catch (error) {
        console.log("Error occurred", error);
        const errorMessage = error.response ? error.response.data.message : 'An error occurred. Please try again.';
        dispatch(Failed(errorMessage));
    }
};




export const comment_main = async (comment_text, blog_id, dispatch) => {
    dispatch(Request());
    console.log('request')
    try {
        const token = localStorage.getItem('accessToken'); // Or wherever you store the token
        console.log(token)
        const response = await axios.post('http://localhost:9001/user/commentBlog', {
            comment_text,
            blog_id
        }, {
            headers: {
                'token': `${token} `// Pass the token in the Authorization header
            }
        });

        console.log('siri',response.data)
        if (response.data.success) {
            dispatch(Success(response.data.token));
        } else {
            dispatch(Failed(response.data.message));
        }
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : 'An error occurred. Please try again.';
        dispatch(Failed(errorMessage));
    }
};


export const commentsBlogId_main = async (blog_id, dispatch) => {
    dispatch(Request());
    try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:9001/user/getCommentsBlogId', {
            params: { blog_id },
            headers: {
                'token':` ${token}`
            }
        });
        console.log('Fetched Comments:', response.data.comments);

        if (response.data.success) {
            dispatch(Success(response.data.comments));
            return response.data.comments; // Return the comments
        } else {
            dispatch(Failed(response.data.message));
            return [];
        }
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : 'An error occurred. Please try again.';
        dispatch(Failed(errorMessage));
        return [];
    }
};

export const commentUsername_main = async (user_id, dispatch) => {
    dispatch(Request());
    try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:9001/user/getUsername', {
            params: { user_id },
            headers: {
                'token':` ${token}`
            }
        });
        console.log('Fetched Username:', response.data.user_name);
        if (response.data.user_name) {
            dispatch(Success(response.data.user_name));
            return response.data.user_name;
        } else {
            dispatch(Failed('Username not found'));
            return null;
        }
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : 'An error occurred. Please try again.';
        dispatch(Failed(errorMessage));
        return null;
    }
};


export const createBlog_main = async (formData, dispatch, token) => {
    dispatch(Request());
    try {
        const response = await fetch('http://localhost:9001/user/createBlog', {
            method: 'POST',
            headers: {
                token: `${token}`,
                // 'Content-Type': 'application/json', // Since we're sending JSON now
            },
            body:formData,
        });
        
        if (!response.ok) {
            throw new Error('Failed to create blog');
        }
        
        const data = await response.json();
        dispatch(Success(data));
    } catch (error) {
        dispatch(Failed(error.message));
    }
};
export const Login_main_user= async (user_email, user_password, dispatch) => {
    dispatch(Request());
    try {
        const response = await axios.post('http://localhost:9001/user/login', {
            user_email,
            user_password
        });

        if (response.data.success) {
            dispatch(Success(response.data.token));
        } else {
            dispatch(Failed(response.data.message));
        }
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : 'An error occurred. Please try again.';
        dispatch(Failed(errorMessage));
    }
};
export const SignUp_main_user = async (
    user_fname, 
    user_lname, 
    user_name, 
    user_email, 
    user_password, 
    user_confirm_password, 
    dispatch
) => {
    dispatch(Request());
    try {
        console.log("Dispatching request");
        const response = await axios.post('http://localhost:9001/user/register', {
            user_fname, 
            user_lname, 
            user_name, 
            user_email, 
            user_password, 
            user_confirm_password
        });
        console.log("Response received", response.data);
        if (response.data.success) {
            console.log("Sign-up successful, dispatching success");
            dispatch(Success(response.data.token));
        } else {
            console.log("Sign-up failed, dispatching failed");
            dispatch(Failed(response.data.message));
        }
    } catch (error) {
        console.log("Error occurred", error);
        const errorMessage = error.response ? error.response.data.message : 'An error occurred. Please try again.';
        dispatch(Failed(errorMessage));
    }
};


export const share_main = async (blog_id, dispatch) => {
    dispatch(Request());
    try {
        const token = localStorage.getItem('accessToken');

        const response = await axios.post('http://localhost:9001/user/shareBlog', {
            blog_id
        }, {
            headers: {
                'token': `${token} `// Pass the token in the Authorization header
            }
        });

        if (response.data.success) {
            dispatch(Success(response.data.message));
        } else {
            dispatch(Failed(response.data.message));
        }
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : 'An error occurred. Please try again.';
        dispatch(Failed(errorMessage));
    }
};
export const Login_main_google= async (user_email,dispatch) => {
    dispatch(Request());
    try {
        const response = await axios.post('http://localhost:9001/user/google/login', {
            user_email
        });

        if (response.data.success) {
            dispatch(Success(response.data.token));
        } else {
            dispatch(Failed(response.data.message));
        }
    } catch (error) {
        const errorMessage = error.response ? error.response.data.message : 'An error occurred. Please try again.';
        dispatch(Failed(errorMessage));
    }
}