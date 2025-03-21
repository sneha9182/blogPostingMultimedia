import axios from 'axios';
import { useState } from 'react';

// Fetch users data
export const GetUsersData = () => {
  const [usersData, setUsersData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchUsersData = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found, please log in again.');
      }

      const response = await axios.get('http://localhost:9001/admin/getUsersData', {
        headers: {
          token: `${token}`,
        },
      });

      if (Array.isArray(response.data)) {
        setUsersData(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
        setErrorMessage('Unexpected response format.');
        setUsersData([]);
      }
    } catch (error) {
      console.error('Error fetching users data:', error.message);
      setErrorMessage(error.message);
      setUsersData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { usersData, isLoading, errorMessage, fetchUsersData };
};

// Fetch all blogs data
export const GetBlogsData = () => {
  const [blogsData, setBlogsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchBlogsData = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found, please log in again.');
      }

      const response = await axios.get('http://localhost:9001/admin/getBlogsData', {
        headers: {
          token: `${token}`,
        },
      });

      if (Array.isArray(response.data)) {
        setBlogsData(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
        setErrorMessage('Unexpected response format.');
        setBlogsData([]);
      }
    } catch (error) {
      console.error('Error fetching blogs data:', error.message);
      setErrorMessage(error.message);
      setBlogsData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { blogsData, isLoading, errorMessage, fetchBlogsData };
};

// Fetch pending blogs data
export const GetPendingBlogsData = () => {
  const [pendingBlogsData, setPendingBlogsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  console.log('i am here')
  
  const fetchPendingBlogsData = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw new Error('No token found, please log in again.');
        }

        const response = await axios.get('http://localhost:9001/admin/getPendingBlogs', {
            headers: {
                token: ` ${token}`, // Use Authorization header with Bearer token
            },
        });

        if (Array.isArray(response.data)) {
           
                setPendingBlogsData(response.data);
            
        } else {
            console.error('Unexpected response format:', response.data);
            setErrorMessage('Unexpected response format.');
            setPendingBlogsData([]);
        }
    } catch (error) {
        console.error('Error fetching pending blogs data:', error.message);
        setErrorMessage(error.message);
        setPendingBlogsData([]);
    } finally {
        setIsLoading(false);
    }
};

  

  return { pendingBlogsData, isLoading, errorMessage ,fetchPendingBlogsData};
};

// Fetch accepted blogs data
export const GetAcceptedBlogsData = () => {
  const [acceptedBlogsData, setAcceptedBlogsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchAcceptedBlogsData = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found, please log in again.');
      }

      const response = await axios.get('http://localhost:9001/admin/getAcceptedBlogs', {
        headers: {
          token: `${token}`,
        },
      });
      console.log(response.data)
      if (Array.isArray(response.data)) {
        setAcceptedBlogsData(response.data);

      } else {
        console.error('Unexpected response format:', response.data);
        setErrorMessage('Unexpected response format.');
        setAcceptedBlogsData([]);
      }
    } catch (error) {
      console.error('Error fetching accepted blogs data:', error.message);
      setErrorMessage(error.message);
      setAcceptedBlogsData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { acceptedBlogsData, isLoading, errorMessage, fetchAcceptedBlogsData };
};

// Fetch rejected blogs data
export const GetRejectedBlogsData = () => {
  const [rejectedBlogsData, setRejectedBlogsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchRejectedBlogsData = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found, please log in again.');
      }

      const response = await axios.get('http://localhost:9001/admin/getRejectedBlogs', {
        headers: {
          token: `${token}`,
        },
      });

      if (Array.isArray(response.data)) {
        setRejectedBlogsData(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
        setErrorMessage('Unexpected response format.');
        setRejectedBlogsData([]);
      }
    } catch (error) {
      console.error('Error fetching rejected blogs data:', error.message);
      setErrorMessage(error.message);
      setRejectedBlogsData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { rejectedBlogsData, isLoading, errorMessage, fetchRejectedBlogsData };
};
